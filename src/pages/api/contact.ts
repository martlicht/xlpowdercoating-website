import type { APIRoute } from 'astro';

// Marcar este endpoint como server-rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar que el body no esté vacío
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let formData;
    try {
      const bodyText = await request.text();
      if (!bodyText || bodyText.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Request body is empty' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      formData = JSON.parse(bodyText);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown error' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener variables de entorno
    let API_URL = import.meta.env.PUBLIC_API_URL || import.meta.env.API_URL;
    const API_KEY = import.meta.env.PUBLIC_API_KEY || import.meta.env.API_KEY;

    if (!API_URL || !API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API configuration missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Asegurar que la URL tenga protocolo
    if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
      API_URL = `https://${API_URL}`;
    }
    
    // Remover trailing slash si existe
    API_URL = API_URL.replace(/\/$/, '');

    // Mapear los valores del servicio
    const serviceMap: Record<string, string> = {
      'powder-coating': 'Powder coating',
      'touch-ups': 'Touch ups & Recoating',
      'color-matching': 'Custom Color Matching',
      'sandblasting': 'Sandblasting',
      'other': 'Other'
    };

    // Extraer código de país del teléfono (por defecto US si no se detecta)
    const phoneNumber = formData.phone?.replace(/\D/g, '') || '';
    let phoneCountryCode = 'US'; // Por defecto US
    
    // Detectar código de país básico (puedes mejorar esto)
    if (phoneNumber.startsWith('1') && phoneNumber.length === 11) {
      phoneCountryCode = 'US';
    } else if (phoneNumber.startsWith('809') || phoneNumber.startsWith('829') || phoneNumber.startsWith('849')) {
      phoneCountryCode = 'DO';
    }
    // Puedes agregar más detecciones aquí

    // Construir el payload
    const payload = {
      first_name: formData.firstName || '',
      last_name: formData.lastName || '',
      email: formData.email || '',
      phone_number: phoneNumber,
      phone_country_code: formData.phoneCountryCode || phoneCountryCode,
      message: formData.message || '',
      source: 'XL', // Hardcoded como "XL"
      intrested: serviceMap[formData.service] || formData.service || '',
      project: formData.project || ''
    };

    // Realizar la petición al API
    const response = await fetch(`${API_URL}/contacts/leads/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HTTP_APIkey': API_KEY
      },
      body: JSON.stringify(payload)
    });

    let result;
    const responseContentType = response.headers.get('content-type');
    
    if (responseContentType && responseContentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit form', 
          details: typeof result === 'string' ? result : JSON.stringify(result),
          status: response.status
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        data: typeof result === 'object' ? result : null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

