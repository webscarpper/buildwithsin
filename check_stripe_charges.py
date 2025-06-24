#!/usr/bin/env python3
import stripe
import os
from datetime import datetime

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

def check_customer_charges():
    try:
        # Find customer by email
        customers = stripe.Customer.list(email='botezatu.andru2025@gmail.com')
        if not customers.data:
            print('❌ Customer not found')
            return
            
        customer = customers.data[0]
        print(f'🔍 Customer ID: {customer.id}')
        print(f'📧 Email: {customer.email}')
        
        # Get subscriptions
        print(f'\n📋 SUBSCRIPTIONS:')
        subscriptions = stripe.Subscription.list(customer=customer.id)
        for sub in subscriptions.data:
            print(f'   Subscription: {sub.id}')
            print(f'   Status: {sub.status}')
            print(f'   Plan: {sub.items.data[0].price.id if sub.items.data else "None"}')
            if sub.discount:
                print(f'   ✅ Discount: {sub.discount.coupon.percent_off}% off')
                print(f'   Discount ID: {sub.discount.coupon.id}')
            else:
                print(f'   ❌ NO DISCOUNT APPLIED!')
        
        # Get recent charges
        print(f'\n💳 RECENT CHARGES:')
        charges = stripe.Charge.list(customer=customer.id, limit=10)
        for charge in charges.data:
            date = datetime.fromtimestamp(charge.created).strftime('%Y-%m-%d %H:%M:%S')
            print(f'   ${charge.amount/100:.2f} - {charge.status} - {date}')
            if charge.amount >= 100000:  # $1000 or more
                print(f'   🚨 HIGH AMOUNT CHARGE: ${charge.amount/100:.2f}')
                
        # Get recent invoices
        print(f'\n🧾 RECENT INVOICES:')
        invoices = stripe.Invoice.list(customer=customer.id, limit=10)
        for invoice in invoices.data:
            date = datetime.fromtimestamp(invoice.created).strftime('%Y-%m-%d %H:%M:%S')
            print(f'   ${invoice.amount_paid/100:.2f} - {invoice.status} - {date}')
            if invoice.amount_due >= 100000:  # $1000 or more
                print(f'   🚨 HIGH AMOUNT INVOICE: ${invoice.amount_due/100:.2f}')
        
        # Get payment methods
        print(f'\n💳 PAYMENT METHODS:')
        payment_methods = stripe.PaymentMethod.list(customer=customer.id, type='card')
        for pm in payment_methods.data:
            print(f'   Card: **** {pm.card.last4} ({pm.card.brand})')
            
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == '__main__':
    check_customer_charges()