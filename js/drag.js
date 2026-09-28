// Drag and drop as an enhancement for controls that already work with
// buttons (a bucket sorter, a ranked list, a two-by-two map).
//
// Register `SumiDrag` as a LiveView hook on a container with an id and
// `data-drop-op`. Inside it, draggable elements carry `data-drag-id` and
// `draggable="true"`; drop zones carry `data-drop-value`. A drop pushes
// `card_op` (or the container's `data-drop-event`) with
// `{op, id, to}`: the operation, the dragged id and the zone's value.
export const SumiDrag = {
  mounted() {
    this.dragged = null;

    this.onStart = (event) => {
      const item = event.target.closest("[data-drag-id]");
      if (!item || item.getAttribute("draggable") !== "true") return;
      this.dragged = item.dataset.dragId;
      item.dataset.dragging = "";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", this.dragged);
    };

    this.onOver = (event) => {
      const zone = this.zone(event.target);
      if (!zone || this.dragged === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      this.mark(zone);
    };

    this.onDrop = (event) => {
      const zone = this.zone(event.target);
      if (!zone || this.dragged === null) return;
      event.preventDefault();
      this.pushEvent(this.el.dataset.dropEvent || "card_op", {
        op: this.el.dataset.dropOp,
        id: this.dragged,
        to: zone.dataset.dropValue,
      });
      this.clear();
    };

    this.onEnd = () => this.clear();

    this.el.addEventListener("dragstart", this.onStart);
    this.el.addEventListener("dragover", this.onOver);
    this.el.addEventListener("drop", this.onDrop);
    this.el.addEventListener("dragend", this.onEnd);
  },

  destroyed() {
    this.el.removeEventListener("dragstart", this.onStart);
    this.el.removeEventListener("dragover", this.onOver);
    this.el.removeEventListener("drop", this.onDrop);
    this.el.removeEventListener("dragend", this.onEnd);
  },

  zone(target) {
    const zone = target instanceof Element ? target.closest("[data-drop-value]") : null;
    return zone && this.el.contains(zone) ? zone : null;
  },

  mark(zone) {
    if (this.active === zone) return;
    if (this.active) delete this.active.dataset.dropActive;
    this.active = zone;
    zone.dataset.dropActive = "";
  },

  clear() {
    this.el.querySelectorAll("[data-dragging]").forEach((el) => delete el.dataset.dragging);
    if (this.active) delete this.active.dataset.dropActive;
    this.active = null;
    this.dragged = null;
  },
};
