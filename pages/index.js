import Head from 'next/head'
import { useState, useEffect } from 'react';

const subscriboUrl = 'https://subscribo-git-dev-integration-subscribo-org.vercel.app';
const apiKey = 'api-key';

export default function Home() {
  const [subscriptionName, setSubscriptionName] = useState('');
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState(null);

  const createSubscription = async () => {
    const response = await fetch(`${subscriboUrl}/api/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        title: subscriptionName,
        address: {
          apartmentNumber: '1',
          buildingNumber: '1',
          country: 'Polska',
          city: 'Wrocław',
          postalCode: '00-000',
          street: 'Oławska'
        },
        buyerType: 'Person',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        delivery: {
          address: {
            apartmentNumber: '2',
            buildingNumber: '2',
            country: 'Polska',
            city: 'Warszawa',
            postalCode: '10-000',
            street: 'Miodowa'
          },
          frequency: 'Monthly',
          type: 'Courier'
        },
        email,
        nextDeliveryDate: new Date('07-30-2021').toISOString(),
        notes: 'My notes',
        phone: '111222333',
        products: [
          {
            name: 'Product 1',
            quantity: 1,
            unitPrice: 1000,
            imageSrc: 'https://cdn.sanity.io/images/za62yfys/staging/e4520ee6bba8964a89bb6835f01a183024e47091-210x210.jpg',
            eanCode: '123456',
            externalId: 'id-1'
          },
          {
            name: 'Product 2',
            quantity: 5,
            unitPrice: 2000,
            eanCode: '123456-2',
            externalId: 'id-2'
          }
        ],
        recipients: '3',
      })
    });
    const newSubscription = await response.json();
    setSubscription(newSubscription);
  }

  useEffect(() => {
    const listener = (event) => {
      console.log(event.data);
    };
    window?.addEventListener('message', listener);
    return () => window?.removeEventListener(listener);
  }, []);

  return (
    <div>
      <Head>
        <title>Subscribo Integration Example</title>
        <link rel='icon' href='/favicon.ico'/>
      </Head>
      <div style={{ padding: '32px' }}>
        {subscription ? <iframe
          width={800}
          height={800}
          src={`${subscriboUrl}/payment-widget?subscriptionId=${subscription.subscription.id}`}
        /> : <>
          <div>
            <label>
              Subscription name
              <input value={subscriptionName} onChange={e => setSubscriptionName(e.target.value)}/>
            </label>
          </div>
          <div>
            <label>
              E-mail address
              <input value={email} onChange={e => setEmail(e.target.value)}/>
            </label>
          </div>
          <button onClick={createSubscription} type="button">Create subscription</button>
        </>}
      </div>
    </div>
  )
}
