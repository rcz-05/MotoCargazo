# MotoCargo MVP QA Checklist

## Auth and Session
- [ ] Restaurant can sign in and lands in restaurant stack.
- [ ] Producer can sign in and lands in producer stack.
- [ ] Producer signup is blocked without active invitation.
- [ ] Forgot-password request sends successfully.

## Restaurant Flow
- [ ] Home categories load and navigate to provider list.
- [ ] Provider list loads category-matching producers.
- [ ] Product detail supports quantity updates and cart insertion.
- [ ] Cart updates quantity and subtotal correctly.
- [ ] Checkout blocks when no active contract.
- [ ] Checkout validates compliance before confirmation.
- [ ] Successful checkout creates order and redirects to confirmation.

## Contract Flow
- [ ] Restaurant can create contract draft from app.
- [ ] Restaurant can request revision with deltas.
- [ ] Restaurant can accept current contract version.
- [ ] Acceptance creates audit row in `contract_acceptances`.

## Recurring Automation
- [ ] Restaurant can create recurring plan bound to active contract.
- [ ] `orders-generate-recurring` creates orders for eligible plans.
- [ ] Auto-confirm true creates `submitted`; false creates `proposed`.

## Producer Flow
- [ ] Producer sees today’s order list.
- [ ] Producer can move order through valid status transitions.
- [ ] Invalid transitions are blocked by trigger.

## Admin Flow
- [ ] Invitations page creates pending producer invites.
- [ ] City rules page lists Seville zones and constraints.
- [ ] Producers page lists active producers.
- [ ] Contracts page displays status and version.
- [ ] Orders page shows latest operational orders.

## Notifications
- [ ] `notifications-dispatch` inserts in-app and email notification rows.
- [ ] Notifications are visible for intended recipients.

## Resilience
- [ ] Network/API failures show non-crashing error states.
- [ ] Expired session redirects to auth.
- [ ] Empty states render for no-data tables and lists.
