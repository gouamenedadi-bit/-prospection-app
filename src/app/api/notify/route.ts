import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Logique fictive d'envoi de notification (WhatsApp/SMS)
    const { phone, message } = body;
    
    console.log(`[WhatsApp API Mock] Sending to ${phone}: ${message}`);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Notification envoyée avec succès.' 
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Erreur d\'envoi' }, { status: 500 });
  }
}
