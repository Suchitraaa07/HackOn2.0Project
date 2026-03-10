import random

def generate_post(goal, platform, audience, tone):

    templates = [
        f"🔥 Big news for {audience}! Our {goal} campaign is live on {platform}. Don't miss out!",
        f"🚀 Attention {audience}! We're launching something exciting on {platform}. Stay tuned!",
        f"✨ {tone.capitalize()} vibes only! Join our {goal} campaign on {platform} today!",
        f"🎉 Something special for {audience}! Check out our latest update on {platform}."
    ]

    return random.choice(templates)