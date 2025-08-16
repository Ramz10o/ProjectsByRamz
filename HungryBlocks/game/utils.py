import random

def get_random_colour(n=1):
    """Generate n random RGB colors as a tuple."""
    return tuple((random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)) for _ in range(n))
