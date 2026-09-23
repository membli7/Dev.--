from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Tuple

ACCOUNTING_PRINCIPLES = [
    {"name": "Economic Entity", "description": "The business is separate from its owners and other businesses."},
    {"name": "Going Concern", "description": "The business is assumed to continue operating in the foreseeable future."},
    {"name": "Monetary Unit", "description": "Only transactions measurable in a common monetary unit are recorded."},
    {"name": "Periodicity", "description": "Reports are prepared for defined accounting periods."},
    {"name": "Accrual Basis", "description": "Revenue and expenses are recognized when they occur, not only when cash moves."},
    {"name": "Matching Principle", "description": "Expenses are matched with the revenues they help generate."},
    {"name": "Revenue Recognition", "description": "Revenue is recognized when earned and realizable."},
    {"name": "Historical Cost", "description": "Assets are initially recorded at their acquisition cost."},
    {"name": "Consistency", "description": "Accounting methods are applied consistently between periods."},
    {"name": "Conservatism (Prudence)", "description": "Uncertain losses are recognized promptly, while uncertain gains are not overstated."},
    {"name": "Materiality", "description": "Items are reported according to whether they could influence decisions."},
    {"name": "Full Disclosure", "description": "Relevant information that could affect decisions is disclosed."},
    {"name": "Objectivity", "description": "Records are supported by verifiable evidence."},
    {"name": "Double-Entry Bookkeeping", "description": "Every transaction affects at least two accounts and total debits equal total credits."},
]


def money(value: str | Decimal) -> Decimal:
    return (value if isinstance(value, Decimal) else Decimal(str(value))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


@dataclass
class Account:
    code: str
    name: str
    category: str
    balance: Decimal = Decimal("0.00")

    def __post_init__(self) -> None:
        self.category = self.category.lower()
        if self.category not in {"asset", "liability", "equity", "revenue", "expense"}:
            raise ValueError("Category must be asset, liability, equity, revenue, or expense")

    @property
    def normal_side(self) -> str:
        return "debit" if self.category in {"asset", "expense"} else "credit"

    def post(self, amount: Decimal, side: str) -> None:
        if side not in {"debit", "credit"}:
            raise ValueError("Side must be debit or credit")
        self.balance += amount if side == self.normal_side else -amount


@dataclass
class EntryLine:
    account: str
    side: str
    amount: Decimal

    def __post_init__(self) -> None:
        self.side = self.side.lower()
        self.amount = money(self.amount)
        if self.side not in {"debit", "credit"} or self.amount <= 0:
            raise ValueError("Each line needs a positive amount and debit/credit side")


@dataclass
class JournalEntry:
    date: str
    description: str
    lines: List[EntryLine] = field(default_factory=list)

    def validate(self) -> None:
        if not self.lines:
            raise ValueError("A journal entry requires at least one line")
        debits = sum((x.amount for x in self.lines if x.side == "debit"), Decimal("0.00"))
        credits = sum((x.amount for x in self.lines if x.side == "credit"), Decimal("0.00"))
        if debits != credits:
            raise ValueError(f"Entry is unbalanced: debits {debits} != credits {credits}")


class AccountingLedger:
    def __init__(self) -> None:
        self.accounts: Dict[str, Account] = {}
        self.entries: List[JournalEntry] = []

    def add_account(self, code: str, name: str, category: str) -> Account:
        if not code or code in self.accounts:
            raise ValueError(f"Account code is empty or already exists: {code}")
        account = Account(code, name, category)
        self.accounts[code] = account
        return account

    def record_entry(self, entry: JournalEntry) -> None:
        entry.validate()
        for line in entry.lines:
            if line.account not in self.accounts:
                raise ValueError(f"Unknown account code: {line.account}")
        for line in entry.lines:
            self.accounts[line.account].post(line.amount, line.side)
        self.entries.append(entry)

    def trial_balance(self) -> List[Tuple[str, str, Decimal, Decimal]]:
        result = []
        for code, account in sorted(self.accounts.items()):
            debit = credit = Decimal("0.00")
            if account.balance >= 0:
                if account.normal_side == "debit": debit = account.balance
                else: credit = account.balance
            elif account.normal_side == "debit": credit = -account.balance
            else: debit = -account.balance
            result.append((code, account.name, debit, credit))
        return result

    def income_statement(self) -> Tuple[Decimal, Decimal, Decimal]:
        revenue = sum((a.balance for a in self.accounts.values() if a.category == "revenue"), Decimal("0.00"))
        expenses = sum((a.balance for a in self.accounts.values() if a.category == "expense"), Decimal("0.00"))
        return revenue, expenses, revenue - expenses

    def balance_sheet(self) -> Tuple[Decimal, Decimal, Decimal]:
        assets = sum((a.balance for a in self.accounts.values() if a.category == "asset"), Decimal("0.00"))
        liabilities = sum((a.balance for a in self.accounts.values() if a.category == "liability"), Decimal("0.00"))
        equity = sum((a.balance for a in self.accounts.values() if a.category == "equity"), Decimal("0.00"))
        return assets, liabilities, equity

    def ledger_report(self) -> str:
        output = []
        for entry in self.entries:
            output.append(f"{entry.date} | {entry.description}")
            output.extend(f"  {line.account}: {line.side.upper()} {line.amount}" for line in entry.lines)
        return "\n".join(output) or "No journal entries recorded."

    @staticmethod
    def principles_report() -> str:
        return "\n".join(f"- {p['name']}: {p['description']}" for p in ACCOUNTING_PRINCIPLES)


def seed_default_accounts(ledger: AccountingLedger) -> None:
    for code, name, category in [
        ("Cash", "Cash", "asset"), ("AccountsReceivable", "Accounts Receivable", "asset"),
        ("OfficeEquipment", "Office Equipment", "asset"), ("AccountsPayable", "Accounts Payable", "liability"),
        ("OwnerCapital", "Owner Capital", "equity"), ("SalesRevenue", "Sales Revenue", "revenue"),
        ("ServiceRevenue", "Service Revenue", "revenue"), ("RentExpense", "Rent Expense", "expense"),
        ("SalariesExpense", "Salaries Expense", "expense"), ("UtilitiesExpense", "Utilities Expense", "expense"),
    ]:
        ledger.add_account(code, name, category)


def run_cli() -> None:
    ledger = AccountingLedger()
    seed_default_accounts(ledger)
    while True:
        print("\n=== Accounting Program ===")
        print("1 Accounts  2 Add account  3 Journal entry  4 Ledger")
        print("5 Trial balance  6 Financial statements  7 Principles  8 Exit")
        choice = input("Select: ").strip()
        try:
            if choice == "1":
                for code, account in sorted(ledger.accounts.items()):
                    print(f"{code}: {account.name} [{account.category}] {account.balance}")
            elif choice == "2":
                ledger.add_account(input("Code: ").strip(), input("Name: ").strip(), input("Category: ").strip())
            elif choice == "3":
                lines = []
                for _ in range(int(input("Number of lines: "))):
                    lines.append(EntryLine(input("Account code: ").strip(), input("Debit/Credit: ").strip(), money(input("Amount: "))))
                ledger.record_entry(JournalEntry(input("Date: ").strip(), input("Description: ").strip(), lines))
                print("Entry recorded.")
            elif choice == "4": print(ledger.ledger_report())
            elif choice == "5":
                for row in ledger.trial_balance(): print(row)
            elif choice == "6":
                print("Income statement:", ledger.income_statement())
                print("Balance sheet:", ledger.balance_sheet())
            elif choice == "7": print(ledger.principles_report())
            elif choice == "8": break
            else: print("Invalid option")
        except (ValueError, ArithmeticError) as error:
            print(f"Error: {error}")


if __name__ == "__main__":
    run_cli()
