#!/usr/bin/env python3

import json, sys, os, random, hashlib, time

# ------------------------------------------------------------
# core-rupt-a-cot.py
# The deep mutation lens.
# Reads an egg, ruptures its core identity, and hands it back
# to watcher.js with morph_n_time = 2.
# ------------------------------------------------------------

def load_egg(egg_id):
    path = f"eggs/egg-{egg_id}.json"
    if not os.path.exists(path):
        raise FileNotFoundError(f"Egg not found: {path}")
    with open(path, "r") as f:
        egg = json.load(f)
    egg["_path"] = path
    return egg

def save_egg(egg):
    path = egg["_path"]
    copy = dict(egg)
    del copy["_path"]
    with open(path, "w") as f:
        json.dump(copy, f, indent=2)

# ------------------------------------------------------------
# CORE RUPTURE FUNCTIONS
# ------------------------------------------------------------

def rupture_species_seed(seed):
    """Flip bits, inject noise, mutate identity."""
    seed_str = str(seed)
    noise = str(random.randint(1000, 9999))
    hashed = hashlib.sha256((seed_str + noise).encode()).hexdigest()
    return hashed[:32]  # shortened mutated seed

def distort_trait_value(value):
    """Distort numeric traits with controlled chaos."""
    if not isinstance(value, (int, float)):
        return value
    factor = random.uniform(0.7, 1.4)
    return round(value * factor, 3)

def mutate_traits(traits):
    """Warp, duplicate, delete, and distort trait clusters."""
    new_traits = {}

    for key, val in traits.items():
        # 1. Distort existing trait
        new_traits[key] = distort_trait_value(val)

        # 2. Chance to duplicate trait
        if random.random() < 0.15:
            new_traits[key + "_echo"] = distort_trait_value(val)

        # 3. Chance to delete trait
        if random.random() < 0.10:
            continue

    # 4. Chance to inject a new chaotic trait
    if random.random() < 0.25:
        new_traits[f"rupt_{random.randint(100,999)}"] = random.random()

    return new_traits

def inject_instability(egg):
    """Add instability index to push morph potential."""
    egg["instability"] = egg.get("instability", 0) + random.uniform(0.1, 0.5)

# ------------------------------------------------------------
# MAIN MUTATION PIPELINE
# ------------------------------------------------------------

def core_rupt(egg):
    print(f"[core-rupt-a-cot] rupturing egg {egg.get('id')}")

    # --- 1. Rupture species seed --------------------------------
    if "species_seed" in egg:
        egg["species_seed"] = rupture_species_seed(egg["species_seed"])
    else:
        egg["species_seed"] = rupture_species_seed(time.time())

    # --- 2. Mutate traits ---------------------------------------
    if "traits" in egg:
        egg["traits"] = mutate_traits(egg["traits"])
    else:
        egg["traits"] = {"rupt_init": random.random()}

    # --- 3. Inject instability ----------------------------------
    inject_instability(egg)

    # --- 4. Signal watcher that mutation is complete ------------
    egg["morph_n_time"] = 2

    return egg

# ------------------------------------------------------------
# ENTRY POINT
# ------------------------------------------------------------

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise ValueError("Usage: core-rupt-a-cot.py <egg-id>")

    egg_id = sys.argv[1]
    egg = load_egg(egg_id)

    mutated = core_rupt(egg)
    save_egg(mutated)

    print(f"[core-rupt-a-cot] complete → morph_n_time = 2")
