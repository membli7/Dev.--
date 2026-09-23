import unittest
from decimal import Decimal

from accounting_program import AccountingLedger, ACCOUNTING_PRINCIPLES, EntryLine, JournalEntry, seed_default_accounts


class AccountingProgramTests(unittest.TestCase):
    def setUp(self):
        self.ledger = AccountingLedger()
        seed_default_accounts(self.ledger)

    def test_double_entry_balances(self):
        self.ledger.record_entry(
            JournalEntry(
                date="2026-09-23",
                description="Cash sale",
                lines=[
                    EntryLine(account="Cash", side="debit", amount=Decimal("100.00")),
                    EntryLine(account="SalesRevenue", side="credit", amount=Decimal("100.00")),
                ],
            )
        )
        self.assertEqual(self.ledger.accounts["Cash"].balance, Decimal("100.00"))
        self.assertEqual(self.ledger.accounts["SalesRevenue"].balance, Decimal("100.00"))

    def test_unbalanced_entry_rejected(self):
        with self.assertRaises(ValueError):
            self.ledger.record_entry(
                JournalEntry(
                    date="2026-09-23",
                    description="Bad entry",
                    lines=[
                        EntryLine(account="Cash", side="debit", amount=Decimal("100.00")),
                        EntryLine(account="AccountsPayable", side="credit", amount=Decimal("50.00")),
                    ],
                )
            )

    def test_accounting_principles_set_complete(self):
        principle_names = {principle["name"] for principle in ACCOUNTING_PRINCIPLES}
        required = {
            "Economic Entity",
            "Going Concern",
            "Monetary Unit",
            "Periodicity",
            "Accrual Basis",
            "Matching Principle",
            "Revenue Recognition",
            "Historical Cost",
            "Consistency",
            "Conservatism (Prudence)",
            "Materiality",
            "Full Disclosure",
            "Objectivity",
            "Double-Entry Bookkeeping",
        }
        self.assertTrue(required.issubset(principle_names))


if __name__ == "__main__":
    unittest.main()
