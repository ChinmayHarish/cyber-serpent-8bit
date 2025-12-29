export class Snake {
    constructor(gridSize, tileCount) {
        this.gridSize = gridSize;
        this.tileCount = tileCount;
        this.body = [];
        this.direction = "right";
        this.nextDirection = "right";
        this.color = "#D3D3D3";
        this.disintegrating = false;
        this.reset();
    }

    reset() {
        this.body = [
            { x: 5, y: 10 },
            { x: 4, y: 10 },
            { x: 3, y: 10 }
        ];
        this.direction = "right";
        this.nextDirection = "right";
        this.color = "#D3D3D3";
        this.disintegrating = false;
    }

    updateGridSize(newGridSize, newTileCount) {
        this.gridSize = newGridSize;
        this.tileCount = newTileCount;
        // Clamp positions if grid shrunk
        this.body.forEach((segment) => {
            segment.x = Math.min(segment.x, this.tileCount - 1);
            segment.y = Math.min(segment.y, this.tileCount - 1);
        });
    }

    setDirection(newDir) {
        const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
        if (newDir !== opposites[this.direction]) {
            this.nextDirection = newDir;
        }
    }

    move() {
        this.direction = this.nextDirection;
        const head = { ...this.body[0] };
        const moves = {
            up: () => head.y--,
            down: () => head.y++,
            left: () => head.x--,
            right: () => head.x++
        };
        moves[this.direction]();
        return head;
    }

    setTileCount(count) {
        this.tileCount = count;
    }

    checkCollision(head) {
        // Wall collision
        if (
            head.x < 0 ||
            head.x >= this.tileCount ||
            head.y < 0 ||
            head.y >= this.tileCount
        ) {
            return true;
        }
        // Self collision
        return this.body
            .slice(1)
            .some((segment) => head.x === segment.x && head.y === segment.y);
    }

    grow(head) {
        this.body.unshift(head);
    }

    step(head) {
        this.body.pop();
        this.body.unshift(head);
    }
}
