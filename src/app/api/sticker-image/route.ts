import { NextRequest, NextResponse } from 'next/server';

const STICKER_PROMPTS: Record<string, string> = {
  pikachu: 'A cute yellow electric mouse Pokemon (Pikachu) face, simple cartoon style, red cheeks, black eyes, small smile, transparent background',
  charmander: 'A cute orange lizard Pokemon (Charmander) with flame on tail, simple cartoon style, transparent background',
  squirtle: 'A cute blue turtle Pokemon (Squirtle) with shell, simple cartoon style, transparent background',
  bulbasaur: 'A cute green dinosaur Pokemon (Bulbasaur) with plant bulb on back, simple cartoon style, transparent background',
  jigglypuff: 'A cute pink round balloon Pokemon (Jigglypuff) with big eyes and microphone, simple cartoon style, transparent background',
  eevee: 'A cute brown fox Pokemon (Eevee) with fluffy collar and big ears, simple cartoon style, transparent background',
  snorlax: 'A cute big sleeping Pokemon (Snorlax), dark blue body, round belly, simple cartoon style, transparent background',
  dragonite: 'A cute orange dragon Pokemon (Dragonite) with wings and antennae, simple cartoon style, transparent background',
  mew: 'A cute small pink psychic Pokemon (Mew) with long tail and big eyes, simple cartoon style, transparent background',
  lucario: 'A cute blue and black fighting Pokemon (Lucario) with aura sensors, simple cartoon style, transparent background',
  gardevoir: 'A cute white and green psychic Pokemon (Gardevoir) with elegant dress-like body, simple cartoon style, transparent background',
  mimikyu: 'A cute ghost Pokemon (Mimikyu) wearing Pikachu costume, simple cartoon style, transparent background',
  wichu1: 'A cute green heart-shaped character (Witchu), kawaii style, simple cartoon, transparent background',
  wichu2: 'A cute star-shaped character (Witchu Star), kawaii style, simple cartoon, transparent background',
  wichu3: 'A cute winking character (Witchu Wink), kawaii style, simple cartoon, transparent background',
  wichu4: 'A cute character making V sign (Witchu V), kawaii style, simple cartoon, transparent background',
  wichu5: 'A cute golden character with crown (Witchu Gold), kawaii style, simple cartoon, transparent background',
  wichu6: 'A cute rainbow-colored character (Witchu Rainbow), kawaii style, simple cartoon, transparent background',
  pika_gold: 'A cute golden shiny Pikachu face, legendary style, simple cartoon, transparent background',
  pika_flying: 'A cute Pikachu holding a balloon and flying, simple cartoon style, transparent background',
  wichu_special: 'A cute special Witchu with sparkles and magic effects, kawaii style, simple cartoon, transparent background',
  pika_rainbow: 'A cute rainbow-colored unicorn Pikachu hybrid, simple cartoon style, transparent background',
  heart: 'A cute pink heart with sparkles, kawaii style, simple cartoon, transparent background',
  star: 'A cute golden star with sparkles, kawaii style, simple cartoon, transparent background',
  flower: 'A cute pink cherry blossom flower, kawaii style, simple cartoon, transparent background',
  cat: 'A cute cat face with big eyes and small nose, kawaii style, simple cartoon, transparent background',
  dog: 'A cute dog face with floppy ears and tongue out, kawaii style, simple cartoon, transparent background',
  rabbit: 'A cute white rabbit with long ears and pink nose, kawaii style, simple cartoon, transparent background',
  panda: 'A cute panda face with black and white markings, kawaii style, simple cartoon, transparent background',
  unicorn: 'A cute unicorn head with rainbow mane and golden horn, kawaii style, simple cartoon, transparent background',
  phoenix: 'A cute phoenix bird with flame wings and golden feathers, kawaii style, simple cartoon, transparent background',
};

export async function GET(request: NextRequest) {
  const stickerId = request.nextUrl.searchParams.get('id');
  
  if (!stickerId) {
    return NextResponse.json({ error: 'Missing sticker ID' }, { status: 400 });
  }

  const prompt = STICKER_PROMPTS[stickerId];
  if (!prompt) {
    return NextResponse.json({ error: 'Unknown sticker' }, { status: 404 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-OpenRouter-Title': 'My AI App',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are an SVG illustration generator. Create a simple, cute SVG illustration based on the user's description. 
Rules:
1. Return ONLY the SVG code, no explanation, no markdown formatting
2. Use 100x100 viewBox
3. Use simple shapes (circles, ellipses, paths, rectangles)
4. Use vibrant, cute colors
5. Make it look like a kawaii sticker/emoji
6. No background (transparent)
7. Keep it simple but recognizable`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json({ error: 'Failed to generate SVG' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // SVG 코드 추출
    const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/);
    if (svgMatch) {
      return new NextResponse(svgMatch[0], {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    
    return NextResponse.json({ error: 'No SVG generated' }, { status: 500 });
  } catch (error) {
    console.error('Sticker image API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}