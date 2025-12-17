/**
 * Simple 2D Bin Packing Algorithm (Shelf Best Fit Fit Heuristic)
 * 
 * We use a Shelf algorithm because it's good for Guillotine-style cuts (common in cardboard manufacturing).
 * 
 * Logic:
 * 1. Sort items by height (descending).
 * 2. Place items into "shelves" of specific height.
 * 3. Create a new shelf if an item doesn't fit in existing ones.
 */

export class BinPacker {
    constructor(binWidth, binHeight) {
        this.binWidth = binWidth;
        this.binHeight = binHeight;
        this.shelves = []; // { x, y, width, height, freeWidth }
    }

    fit(items) {
        // 1. Sort by height descending for better packing ratio
        // We clone to avoid mutating original array
        const sortedItems = [...items].sort((a, b) => b.h - a.h);

        // Results container
        // We might need multiple bins if they don't fit in one. 
        // BUT for "Optimizing 1 Sheet", the user wants to see how ONE sheet fits.
        // If we want multiple bins support, we need a manager class. 
        // Let's implement single-bin packing first, and flag items that didn't fit.

        let packedItems = [];
        let unsuccessfulItems = [];

        // Reset shelves for this run
        this.shelves = [];

        for (let item of sortedItems) {
            const quantity = item.q || 1;

            for (let i = 0; i < quantity; i++) {
                const placed = this.placeItem({ ...item, id: `${item.id}-${i}` });
                if (placed) {
                    packedItems.push(placed);
                } else {
                    // Try rotating? (Swap w/h)
                    const placedRotated = this.placeItem({ ...item, w: item.h, h: item.w, rotated: true, id: `${item.id}-${i}-rot` });
                    if (placedRotated) {
                        packedItems.push(placedRotated);
                    } else {
                        unsuccessfulItems.push({ ...item, index: i });
                    }
                }
            }
        }

        return {
            packedItems,
            unsuccessfulItems,
            efficiency: this.calculateEfficiency(packedItems)
        };
    }

    placeItem(item) {
        // Strategy: Best Area Fit among shelves
        let bestShelf = null;
        let minWaste = Infinity;

        // Try to fit in existing shelves
        for (let shelf of this.shelves) {
            // Must fit in remaining width
            if (shelf.freeWidth >= item.w) {
                // Shelf height must be compatible (item height <= shelf height)
                // Usually shelf height is fixed by the first item, so we check if it fits vertically?
                // In "Shelf First Fit", we usually fix shelf height to the first item added to it.
                // If item is shorter, it wastes vertical space above it.

                if (item.h <= shelf.height) {
                    const waste = shelf.freeWidth - item.w;
                    if (waste < minWaste) {
                        bestShelf = shelf;
                        minWaste = waste;
                    }
                }
            }
        }

        if (bestShelf) {
            // Add to shelf
            const placed = {
                ...item,
                x: bestShelf.x + (bestShelf.width - bestShelf.freeWidth),
                y: bestShelf.y
            };
            bestShelf.freeWidth -= item.w;
            return placed;
        }

        // Create new shelf if possible
        // Shelf Y starts after the last shelf
        let lastShelfY = 0;
        let lastShelfH = 0;
        if (this.shelves.length > 0) {
            const last = this.shelves[this.shelves.length - 1];
            lastShelfY = last.y;
            lastShelfH = last.height;
        }

        const newShelfY = lastShelfY + lastShelfH;

        // Check if new shelf fits in bin vertically
        if (newShelfY + item.h <= this.binHeight) {
            // Create shelf
            const newShelf = {
                x: 0,
                y: newShelfY,
                width: this.binWidth,
                height: item.h, // Shelf height is determined by first item
                freeWidth: this.binWidth - item.w
            };
            this.shelves.push(newShelf);

            return {
                ...item,
                x: 0,
                y: newShelfY
            };
        }

        return null; // Won't fit
    }

    calculateEfficiency(packedItems) {
        const usedArea = packedItems.reduce((sum, item) => sum + (item.w * item.h), 0);
        const totalArea = this.binWidth * this.binHeight;
        return (usedArea / totalArea) * 100;
    }
}
