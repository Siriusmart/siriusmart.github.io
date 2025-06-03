class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    conjugate() {
        return new Complex(this.re, -this.im);
    }

    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    sub(other) {
        return new Complex(this.re - other.re, this.im - other.im);
    }

    mul(other) {
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re,
        );
    }

    div(other) {
        if (other.im === 0)
            return new Complex(this.re / other.re, this.im / other.im);
        else return;
    }

    pow(n) {
        if (n <= 0) return new Complex(1, 0);
        else return this.mul(this.pow(n - 1));
    }

    toString() {
        return `${this.re}${this.im < 0 ? "" : "+"}${this.im}i`;
    }

    magnitudeSquared() {
        return Math.pow(this.re, 2) + Math.pow(this.im, 2);
    }

    iterate(c, expression) {
        let z = this;
        return eval(expression);
    }

    diverges(expression) {
        let z = new Complex(0, 0);
        let c = this;

        for (let i = 0; i < 10; i++) {
            z = z.iterate(c, "z.mul(z).add(c)");
        }

        if (z.magnitudeSquared() > 4)
            return Math.log(Math.sqrt(z.magnitudeSquared()));
        else return 0;
    }
}

self.onmessage = function (event) {
    const { y, scale, width, left, up, expr } = event.data;

    expression = expr;

    for (let x = 0; x < width; x++) {
        let diverges = new Complex(left + scale * x, up - scale * y).diverges(
            expr,
        );
        self.postMessage({
            x,
            y,
            fillStyle: diverges
                ? `rgba(0,0,255,${Math.max(0.1, diverges * 0.05)})`
                : "black",
        });
    }
    // self.postMessage({ x, y, color });
};
