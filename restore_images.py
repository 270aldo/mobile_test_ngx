from google import genai
from google.genai import types
import os
import time

# Usamos la API key del entorno
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def generate_banana_image(prompt, output_file):
    print(f"Generando {output_file}...")
    try:
        # Lógica probada que SÍ funcionó
        contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt)])]
        config = types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"])
        
        stream = client.models.generate_content_stream(
            model='nano-banana-pro-preview', 
            contents=contents, 
            config=config
        )
        
        for chunk in stream:
            if chunk.candidates and chunk.candidates[0].content and chunk.candidates[0].content.parts:
                part = chunk.candidates[0].content.parts[0]
                if part.inline_data and part.inline_data.data:
                    with open(output_file, "wb") as f:
                        f.write(part.inline_data.data)
                    print(f"GUARDADO: {output_file}")
                    return
                    
    except Exception as e:
        print(f"ERROR en {output_file}: {e}")

prompts = {
    "assets/ngx_gym_lift.png": "Cinematic gym atmosphere, dark moody lighting with violet and mint accents, focus on heavy weights or barbell, high contrast, sleek modern fitness aesthetic, 8k resolution, vertical orientation 9:16.",
    "assets/ngx_pullup.png": "Cinematic fitness photography, athlete doing pullups, silhouette against moody lighting, neon mint highlights, intense atmosphere, high quality, 8k, vertical orientation 9:16.",
    "assets/ngx_wearable.png": "Futuristic smartwatch fitness tracker close-up, displaying activity rings, glowing mint and violet interface, dark glass background, tech noir style, high detail product photography, vertical orientation 9:16.",
    "assets/ngx_recovery_light.png": "Abstract soothing energy flow, mint and violet gradient waves, glass texture, ethereal light, calm and restorative atmosphere, high resolution wallpaper style, vertical orientation 9:16."
}

for filename, prompt in prompts.items():
    generate_banana_image(prompt, filename)
    time.sleep(1)
