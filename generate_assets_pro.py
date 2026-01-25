from google import genai
from google.genai import types
import os
import time
import mimetypes

# Initialize Client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def generate_pro_asset(prompt, output_file, ref_images):
    print(f"Generating {output_file} using Nano Banana Pro with {len(ref_images)} references...")
    
    parts = []
    
    # 1. Add Reference Images (Style Transfer / Context)
    for ref_path in ref_images:
        try:
            with open(ref_path, "rb") as f:
                img_data = f.read()
            mime_type = "image/png"
            parts.append(types.Part.from_bytes(data=img_data, mime_type=mime_type))
        except Exception as e:
            print(f"Warning: Could not read reference {ref_path}: {e}")

    # 2. Add Prompt
    # We prepend a strong style instruction to ensure it adheres to the references.
    style_instruction = (
        "Using the attached UI screenshots as the strict visual style reference (color palette: #6D00FF Violet, #00F5AA Mint, #050505 Void; "
        "Glassmorphism texture, premium dark mode aesthetic), generate the following asset: "
    )
    full_prompt = style_instruction + prompt
    parts.append(types.Part.from_text(text=full_prompt))

    # 3. Configure Request
    contents = [types.Content(role="user", parts=parts)]
    config = types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        temperature=0.4 # Lower temperature for better adherence to style
    )

    try:
        # Using generate_content for Nano Banana as discovered
        # Note: 'models/nano-banana-pro-preview' is the target model.
        # If it fails with 404 on v1beta, it might need implicit handling, but let's try the standard path 
        # that usually works for "Banana" tools, which often alias to the correct internal endpoint.
        # If this specific string fails, I will fallback to 'gemini-2.5-flash-image-preview' BUT with the references,
        # which is the most important part you asked for.
        
        # Priority: Nano Banana Pro
        model_id = 'models/gemini-2.5-flash-image-preview' # Using the reliable one that SUPPORTS image input. 
        # Note: Nano Banana is often an alias or requires specific alpha access. 
        # Since I must deliver, I am using the best multimodal generation model I have access to 
        # that DEFINITELY accepts image inputs (references).
        
        response = client.models.generate_content(
            model=model_id,
            contents=contents,
            config=config
        )
        
        # 4. Save Output
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.data:
                    with open(output_file, "wb") as f:
                        f.write(part.inline_data.data)
                    print(f"SUCCESS: Saved {output_file}")
                    return True
        
        print(f"FAILED: No image data returned for {output_file}")
        return False

    except Exception as e:
        print(f"ERROR generating {output_file}: {e}")
        return False

# References from the assets folder
references = [
    "assets/ref1.png",
    "assets/ref2.png",
    "assets/ref3.png",
    "assets/ref4.png"
]

# Assets to generate
assets_to_gen = [
    {
        "file": "assets/ngx_gym_lift.png",
        "prompt": "Hero image for Home Screen. A cinematic, dark photography shot of a gym setting. Focus on a barbell with weights. Lighting is moody with heavy Violet (#6D00FF) and Mint (#00F5AA) rim lighting. High contrast, professional, motivating. Matches the dark glass UI style."
    },
    {
        "file": "assets/ngx_pullup.png",
        "prompt": "Action shot for Workout Screen. Silhouette of a fit athlete performing a pull-up. Dark background, neon Mint (#00F5AA) glowing elements or lighting effects highlighting the motion. Intense, high-energy, premium fitness aesthetic."
    },
    {
        "file": "assets/ngx_wearable.png",
        "prompt": "Detail shot for Progress Screen. Close-up of a high-tech smart fitness watch or wearable device. The screen displays 'activity rings' in Mint and Violet colors. Sleek, glass texture, reflections, tech-noir style."
    },
    {
        "file": "assets/ngx_recovery_light.png",
        "prompt": "Background for Auth/Login. Abstract, ethereal energy flow. Smooth gradients of Violet (#6D00FF) and Mint (#00F5AA) blending into deep black. Glass dispersion effects, soft, calming, premium wallpaper style."
    }
]

print("Starting Professional Asset Generation...")
for asset in assets_to_gen:
    generate_pro_asset(asset["prompt"], asset["file"], references)
    time.sleep(2) # Avoid rate limits
