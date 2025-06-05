let renderID = 0;

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
        else
            return this.mul(other.conjugate()).div(
                new Complex(other.re ** 2 + other.im ** 2, 0),
            );
    }

    pow(n) {
        if (n <= 0) return new Complex(1, 0);
        else return this.mul(this.pow(n - 1));
    }

    toString() {
        return `${this.re}${this.im < 0 ? "" : "+"}${this.im}i`;
    }

    magnitudeSquared() {
        if (this.isBig()) return this.re ** BigInt(2) + this.im ** BigInt(2);
        else return this.re ** 2 + this.im ** 2;
    }

    iterate(c, expression) {
        let z = this;
        return eval(expression);
    }

    toBig() {
        return new Complex(
            BigInt(Math.round(this.re)),
            BigInt(Math.round(this.im)),
        );
    }

    isBig() {
        return typeof this.re == "bigint";
    }

    badState() {
        function isNonValueNumber(value) {
            return (
                Number.isNaN(value) || value === Infinity || value === -Infinity
            );
        }
        return isNonValueNumber(this.im) || isNonValueNumber(this.re);
    }

    diverges(expression, iterations, cutoff, threshold) {
        let z = new Complex(0, 0);
        let c = this;

        let previous;

        for (
            let i = 0;
            i < iterations && (cutoff == -1 || z.magnitudeSquared() < cutoff);
            i++
        ) {
            previous = z;
            z = z.iterate(c, expression);

            if (!z.isBig() && z.badState()) {
                c = c.toBig();
                z = previous.toBig();
                z = z.iterate(c, expression);
            }
        }

        function log10(bigint) {
            if (bigint < 0n) return NaN;
            const s = bigint.toString(10);

            return s.length + Math.log10("0." + s.substring(0, 15));
        }

        let magnitudeSquared = z.magnitudeSquared();
        if (magnitudeSquared > threshold)
            return (
                (z.isBig()
                    ? log10(magnitudeSquared)
                    : Math.log10(magnitudeSquared)) * 0.5
            );
        else return 0;
    }
}

self.onmessage = function (event) {
    if (event.data.setRenderId) {
        renderID = event.data.setRenderId;
        return;
    }

    const {
        y,
        scale,
        width,
        left,
        up,
        expr,
        iterations,
        intensity,
        currentRender,
        cutoff,
        threshold,
    } = event.data;

    expression = expr;

    for (let x = 0; x < width; x++) {
        if (renderID !== currentRender) return;
        let diverges = new Complex(left + scale * x, up - scale * y).diverges(
            expr,
            iterations,
            cutoff,
            threshold,
        );
        let fillStyle;

        if (
            diverges == Infinity ||
            diverges == -Infinity ||
            typeof diverges == "bigint"
        ) {
            fillStyle = "blue";
        } else if (diverges) {
            fillStyle = `color-mix(in srgb, blue ${Math.min(Math.max(0.1, diverges * intensity), 1) * 100}%, white)`;
        } else {
            fillStyle = "black";
        }

        self.postMessage({
            x,
            y,
            fillStyle,
            currentRender,
        });
    }

    self.postMessage({
        doneRow: true,
        currentRender,
    });
};
