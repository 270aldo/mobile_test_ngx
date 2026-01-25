from google import genai
from google.genai import types
import os

# Usamos la API key del entorno
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def generate_image(prompt, output_file):
    print(f"Generando {output_file} con nano-banana-pro-preview...")
    try:
        response = client.models.generate_images(
            model='nano-banana-pro-preview',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="9:16",
            )
        )
        if response.generated_images:
            image = response.generated_images[0]
            with open(output_file, "wb") as f:
                f.write(image.image.image_bytes)
            print(f"GUARDADO REAL: {output_file}")
        else:
            print(f"FALLO: No se devolvió imagen para {output_file}")
    except Exception as e:
        print(f"ERROR en {output_file}: {e}")

prompts = {
    "assets/ngx_gym_lift.png": "Cinematic gym atmosphere, dark moody lighting with violet and mint accents, focus on heavy weights or barbell, high contrast, sleek modern fitness aesthetic, 8k resolution, vertical orientation.",
    "assets/ngx_pullup.png": "Cinematic fitness photography, athlete doing pullups, silhouette against moody lighting, neon mint highlights, intense atmosphere, high quality, 8k, vertical orientation.",
    "assets/ngx_wearable.png": "Futuristic smartwatch fitness tracker close-up, displaying activity rings, glowing mint and violet interface, dark glass background, tech noir style, high detail product photography, vertical orientation.",
    "assets/ngx_recovery_light.png": "Abstract soothing energy flow, mint and violet gradient waves, glass texture, ethereal light, calm and restorative atmosphere, high resolution wallpaper style, vertical orientation."
}

for filename, prompt in prompts.items():
    generate_image(prompt, filename)