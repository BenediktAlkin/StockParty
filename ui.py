import tkinter as tk
from PIL import ImageTk


class Application(tk.Tk):
    def __init__(self, sim, config):
        super().__init__()
        self.sim = sim
        self.display_config = config["display"]
        self.interval = config["uiInterval"]

        self.title("Börsenkurse")
        self.configure(background="white")
        self.resizable(width=True, height=True)
        self.width = self.display_config["width"]
        self.height = self.display_config["height"]
        self.geometry(f"{self.width}x{self.height}")


        self.colums = self.display_config["columns"]
        self.image_canvases = []
        for i in range(self.sim.sim_count):
            canvas = tk.Label(self, borderwidth=0)
            canvas.grid(row=i // self.colums, column=i % self.colums)
            self.image_canvases.append(canvas)

        # hold reference to images to prevent garbage collection
        self.images = None

    def next_image(self):
        w, h = self.winfo_width(), self.winfo_height()
        plots = self.sim.plots(w, h)
        if plots is None: return

        self.images = [ImageTk.PhotoImage(sim_plot) for sim_plot in plots]
        for i in range(len(self.images)):
            self.image_canvases[i].config(image=self.images[i])
        self.after(self.interval, self.next_image)

    def start(self):
        self.next_image()
        #self.display_next_slide()


def main(sim, config):
    application = Application(sim, config)
    application.start()
    application.mainloop()
