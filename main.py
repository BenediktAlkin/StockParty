import sys
import ui
import sim
import yaml

if __name__ == "__main__":
    with open("config.yaml", encoding='utf8') as f:
        config = yaml.safe_load(f)

    if config["saveImages"]:
        sim.Sim(config).save_images(config["display"]["width"], config["display"]["height"])
    else:
        sys.exit(ui.main(sim.Sim(config), config))