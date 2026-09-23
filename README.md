# Dev.-- Accounting Program

A self-contained Python accounting application for learning and managing basic bookkeeping.

## Included functionality

- Chart of accounts with asset, liability, equity, revenue, and expense categories
- Double-entry journal entries
- Debit and credit validation
- General ledger report
- Trial balance
- Income statement
- Balance sheet
- Accounting principles reference
- Interactive command-line interface

## Accounting principles covered

The program documents and applies these core concepts:

1. Economic Entity
2. Going Concern
3. Monetary Unit
4. Periodicity
5. Accrual Basis
6. Matching Principle
7. Revenue Recognition
8. Historical Cost
9. Consistency
10. Conservatism / Prudence
11. Materiality
12. Full Disclosure
13. Objectivity
14. Double-Entry Bookkeeping

> This is an educational bookkeeping application, not a substitute for professional accounting advice or compliance with a specific jurisdiction's accounting standards.

## Requirements

- Python 3.10 or newer
- No third-party packages required

## Run the application

```bash
python accounting_program.py
```

The application starts with common accounts such as Cash, Accounts Receivable, Accounts Payable, Owner Capital, Sales Revenue, and operating expenses.

## Run tests

```bash
python -m unittest test_accounting.py -v
```

## Typical workflow

1. List the default accounts.
2. Add any additional accounts required by the business.
3. Record each transaction as balanced debit and credit lines.
4. Review the general ledger.
5. Confirm that the trial balance totals agree.
6. Review the income statement and balance sheet.
7. Use the principles menu for a quick reference to the accounting concepts implemented by the application.
