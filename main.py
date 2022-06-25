import sys
import ui
import simulation
import yaml


def main():
    with open("config.yaml", encoding='utf8') as f:
        config = yaml.safe_load(f)

    simulation.Sim(config).save_images(config["display"]["width"], config["display"]["height"])


if __name__ == "__main__":
    main()