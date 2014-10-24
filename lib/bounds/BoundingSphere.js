var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoundingVolumeBase = require("awayjs-core/lib/bounds/BoundingVolumeBase");
var PlaneClassification = require("awayjs-core/lib/geom/PlaneClassification");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var BoundingSphere = (function (_super) {
    __extends(BoundingSphere, _super);
    function BoundingSphere() {
        _super.call(this);
        this._radius = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
    }
    Object.defineProperty(BoundingSphere.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: true,
        configurable: true
    });
    BoundingSphere.prototype.nullify = function () {
        _super.prototype.nullify.call(this);
        this._centerX = this._centerY = this._centerZ = 0;
        this._radius = 0;
    };
    BoundingSphere.prototype.isInFrustum = function (planes, numPlanes) {
        for (var i = 0; i < numPlanes; ++i) {
            var plane = planes[i];
            var flippedExtentX = plane.a < 0 ? -this._radius : this._radius;
            var flippedExtentY = plane.b < 0 ? -this._radius : this._radius;
            var flippedExtentZ = plane.c < 0 ? -this._radius : this._radius;
            var projDist = plane.a * (this._centerX + flippedExtentX) + plane.b * (this._centerY + flippedExtentY) + plane.c * (this._centerZ + flippedExtentZ) - plane.d;
            if (projDist < 0) {
                return false;
            }
        }
        return true;
    };
    BoundingSphere.prototype.fromSphere = function (center, radius) {
        this._centerX = center.x;
        this._centerY = center.y;
        this._centerZ = center.z;
        this._radius = radius;
        this._aabb.width = this._aabb.height = this._aabb.depth = radius * 2;
        this._aabb.x = this._centerX - radius;
        this._aabb.y = this._centerY + radius;
        this._aabb.z = this._centerZ - radius;
        this._pAabbPointsDirty = true;
    };
    BoundingSphere.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
        this._centerX = (maxX + minX) * .5;
        this._centerY = (maxY + minY) * .5;
        this._centerZ = (maxZ + minZ) * .5;
        var d = maxX - minX;
        var y = maxY - minY;
        var z = maxZ - minZ;
        if (y > d)
            d = y;
        if (z > d)
            d = z;
        this._radius = d * Math.sqrt(.5);
        _super.prototype.fromExtremes.call(this, minX, minY, minZ, maxX, maxY, maxZ);
    };
    BoundingSphere.prototype.clone = function () {
        var clone = new BoundingSphere();
        clone.fromSphere(new Vector3D(this._centerX, this._centerY, this._centerZ), this._radius);
        return clone;
    };
    BoundingSphere.prototype.rayIntersection = function (position, direction, targetNormal) {
        if (this.containsPoint(position)) {
            return 0;
        }
        var px = position.x - this._centerX, py = position.y - this._centerY, pz = position.z - this._centerZ;
        var vx = direction.x, vy = direction.y, vz = direction.z;
        var rayEntryDistance;
        var a = vx * vx + vy * vy + vz * vz;
        var b = 2 * (px * vx + py * vy + pz * vz);
        var c = px * px + py * py + pz * pz - this._radius * this._radius;
        var det = b * b - 4 * a * c;
        if (det >= 0) {
            var sqrtDet = Math.sqrt(det);
            rayEntryDistance = (-b - sqrtDet) / (2 * a);
            if (rayEntryDistance >= 0) {
                targetNormal.x = px + rayEntryDistance * vx;
                targetNormal.y = py + rayEntryDistance * vy;
                targetNormal.z = pz + rayEntryDistance * vz;
                targetNormal.normalize();
                return rayEntryDistance;
            }
        }
        // ray misses sphere
        return -1;
    };
    BoundingSphere.prototype.containsPoint = function (position) {
        var px = position.x - this._centerX;
        var py = position.y - this._centerY;
        var pz = position.z - this._centerZ;
        var distance = Math.sqrt(px * px + py * py + pz * pz);
        return distance <= this._radius;
    };
    //@override
    BoundingSphere.prototype.classifyToPlane = function (plane) {
        var a = plane.a;
        var b = plane.b;
        var c = plane.c;
        var dd = a * this._centerX + b * this._centerY + c * this._centerZ - plane.d;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;
        if (c < 0)
            c = -c;
        var rr = (a + b + c) * this._radius;
        return dd > rr ? PlaneClassification.FRONT : dd < -rr ? PlaneClassification.BACK : PlaneClassification.INTERSECT;
    };
    BoundingSphere.prototype.transformFrom = function (bounds, matrix) {
        var sphere = bounds;
        var cx = sphere._centerX;
        var cy = sphere._centerY;
        var cz = sphere._centerZ;
        var raw = new Array(16);
        matrix.copyRawDataTo(raw);
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        if (m11 < 0)
            m11 = -m11;
        if (m12 < 0)
            m12 = -m12;
        if (m13 < 0)
            m13 = -m13;
        if (m21 < 0)
            m21 = -m21;
        if (m22 < 0)
            m22 = -m22;
        if (m23 < 0)
            m23 = -m23;
        if (m31 < 0)
            m31 = -m31;
        if (m32 < 0)
            m32 = -m32;
        if (m33 < 0)
            m33 = -m33;
        var r = sphere._radius;
        var rx = m11 + m12 + m13;
        var ry = m21 + m22 + m23;
        var rz = m31 + m32 + m33;
        this._radius = r * Math.sqrt(rx * rx + ry * ry + rz * rz);
        this._aabb.width = this._aabb.height = this._aabb.depth = this._radius * 2;
        this._aabb.x = this._centerX - this._radius;
        this._aabb.y = this._centerY + this._radius;
        this._aabb.z = this._centerZ - this._radius;
    };
    return BoundingSphere;
})(BoundingVolumeBase);
module.exports = BoundingSphere;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1jb3JlL2xpYi9ib3VuZHMvYm91bmRpbmdzcGhlcmUudHMiXSwibmFtZXMiOlsiQm91bmRpbmdTcGhlcmUiLCJCb3VuZGluZ1NwaGVyZS5jb25zdHJ1Y3RvciIsIkJvdW5kaW5nU3BoZXJlLnJhZGl1cyIsIkJvdW5kaW5nU3BoZXJlLm51bGxpZnkiLCJCb3VuZGluZ1NwaGVyZS5pc0luRnJ1c3R1bSIsIkJvdW5kaW5nU3BoZXJlLmZyb21TcGhlcmUiLCJCb3VuZGluZ1NwaGVyZS5mcm9tRXh0cmVtZXMiLCJCb3VuZGluZ1NwaGVyZS5jbG9uZSIsIkJvdW5kaW5nU3BoZXJlLnJheUludGVyc2VjdGlvbiIsIkJvdW5kaW5nU3BoZXJlLmNvbnRhaW5zUG9pbnQiLCJCb3VuZGluZ1NwaGVyZS5jbGFzc2lmeVRvUGxhbmUiLCJCb3VuZGluZ1NwaGVyZS50cmFuc2Zvcm1Gcm9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGtCQUFrQixXQUFhLDJDQUEyQyxDQUFDLENBQUM7QUFHbkYsSUFBTyxtQkFBbUIsV0FBYSwwQ0FBMEMsQ0FBQyxDQUFDO0FBRW5GLElBQU8sUUFBUSxXQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO0FBRWhFLElBQU0sY0FBYztJQUFTQSxVQUF2QkEsY0FBY0EsVUFBMkJBO0lBUTlDQSxTQVJLQSxjQUFjQTtRQVVsQkMsaUJBQU9BLENBQUNBO1FBUERBLFlBQU9BLEdBQVVBLENBQUNBLENBQUNBO1FBQ25CQSxhQUFRQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNwQkEsYUFBUUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDcEJBLGFBQVFBLEdBQVVBLENBQUNBLENBQUNBO0lBSzVCQSxDQUFDQTtJQUVERCxzQkFBV0Esa0NBQU1BO2FBQWpCQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQUVNQSxnQ0FBT0EsR0FBZEE7UUFFQ0csZ0JBQUtBLENBQUNBLE9BQU9BLFdB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LEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUVBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxHQUFVQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNqRUEsSUFBSUEsR0FBR0EsR0FBVUEsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFN0JBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2RBLElBQUlBLE9BQU9BLEdBQVVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3BDQSxnQkFBZ0JBLEdBQUdBLENBQUVBLENBQUNBLENBQUNBLEdBQUdBLE9BQU9BLENBQUVBLEdBQUNBLENBQUVBLENBQUNBLEdBQUNBLENBQUNBLENBQUVBLENBQUNBO1lBQzVDQSxFQUFFQSxDQUFDQSxDQUFDQSxnQkFBZ0JBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsZ0JBQWdCQSxHQUFDQSxFQUFFQSxDQUFDQTtnQkFDMUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLGdCQUFnQkEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQzFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxnQkFBZ0JBLEdBQUNBLEVBQUVBLENBQUNBO2dCQUMxQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7Z0JBRXpCQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1lBQ3pCQSxDQUFDQTtRQUNGQSxDQUFDQTtR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QUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFVQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFVQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUN4RkEsSUFBSUEsR0FBR0EsR0FBVUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBVUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBVUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBVUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDeEZBLElBQUlBLEdBQUdBLEdBQVVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEdBQVVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEdBQVVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLEdBQVVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBRXpGQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxHQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxHQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUMvQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsR0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsR0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDL0NBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLEdBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLEdBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBRS9DQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUVaQSxJQUFJQSxDQUFDQSxHQUFVQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUM5QkEsSUFBSUEsRUFBRUEsR0FBVUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDaENBLElBQUlBLEVBQUVBLEdBQVVBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ2hDQSxJQUFJQSxFQUFFQSxHQUFVQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFbERBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLEdBQUNBLENBQUNBLENBQUNBO1FBQ3pFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUM1Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBO0lBQzdDQSxDQUFDQTtJQUNGWCxxQkFBQ0E7QUFBREEsQ0EvTEEsQUErTENBLEVBL0w0QixrQkFBa0IsRUErTDlDO0FBRUQsQUFBd0IsaUJBQWYsY0FBYyxDQUFDIiwiZmlsZSI6ImJvdW5kcy9Cb3VuZGluZ1NwaGVyZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQm91bmRpbmdWb2x1bWVCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2JvdW5kcy9Cb3VuZGluZ1ZvbHVtZUJhc2VcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFBsYW5lQ2xhc3NpZmljYXRpb25cdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9QbGFuZUNsYXNzaWZpY2F0aW9uXCIpO1xuaW1wb3J0IFBsYW5lM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9QbGFuZTNEXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5cbmNsYXNzIEJvdW5kaW5nU3BoZXJlIGV4dGVuZHMgQm91bmRpbmdWb2x1bWVCYXNlXG57XG5cblx0cHJpdmF0ZSBfcmFkaXVzOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX2NlbnRlclg6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfY2VudGVyWTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9jZW50ZXJaOm51bWJlciA9IDA7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgcmFkaXVzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcmFkaXVzO1xuXHR9XG5cblx0cHVibGljIG51bGxpZnkoKVxuXHR7XG5cdFx0c3VwZXIubnVsbGlmeSgpO1xuXHRcdHRoaXMuX2NlbnRlclggPSB0aGlzLl9jZW50ZXJZID0gdGhpcy5fY2VudGVyWiA9IDA7XG5cdFx0dGhpcy5fcmFkaXVzID0gMDtcblx0fVxuXG5cdHB1YmxpYyBpc0luRnJ1c3R1bShwbGFuZXM6QXJyYXk8UGxhbmUzRD4sIG51bVBsYW5lczpudW1iZXIpOmJvb2xlYW5cblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bVBsYW5lczsgKytpKSB7XG5cdFx0XHR2YXIgcGxhbmU6UGxhbmUzRCA9IHBsYW5lc1tpXTtcblx0XHRcdHZhciBmbGlwcGVkRXh0ZW50WDpudW1iZXIgPSBwbGFuZS5hIDwgMD8gLXRoaXMuX3JhZGl1cyA6IHRoaXMuX3JhZGl1cztcblx0XHRcdHZhciBmbGlwcGVkRXh0ZW50WTpudW1iZXIgPSBwbGFuZS5iIDwgMD8gLXRoaXMuX3JhZGl1cyA6IHRoaXMuX3JhZGl1cztcblx0XHRcdHZhciBmbGlwcGVkRXh0ZW50WjpudW1iZXIgPSBwbGFuZS5jIDwgMD8gLXRoaXMuX3JhZGl1cyA6IHRoaXMuX3JhZGl1cztcblx0XHRcdHZhciBwcm9qRGlzdDpudW1iZXIgPSBwbGFuZS5hKiggdGhpcy5fY2VudGVyWCArIGZsaXBwZWRFeHRlbnRYICkgKyBwbGFuZS5iKiggdGhpcy5fY2VudGVyWSArIGZsaXBwZWRFeHRlbnRZKSArIHBsYW5lLmMqKCB0aGlzLl9jZW50ZXJaICsgZmxpcHBlZEV4dGVudFogKSAtIHBsYW5lLmQ7XG5cdFx0XHRpZiAocHJvakRpc3QgPCAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZnJvbVNwaGVyZShjZW50ZXI6VmVjdG9yM0QsIHJhZGl1czpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9jZW50ZXJYID0gY2VudGVyLng7XG5cdFx0dGhpcy5fY2VudGVyWSA9IGNlbnRlci55O1xuXHRcdHRoaXMuX2NlbnRlclogPSBjZW50ZXIuejtcblx0XHR0aGlzLl9yYWRpdXMgPSByYWRpdXM7XG5cdFx0dGhpcy5fYWFiYi53aWR0aCA9IHRoaXMuX2FhYmIuaGVpZ2h0ID0gdGhpcy5fYWFiYi5kZXB0aCA9IHJhZGl1cyoyO1xuXHRcdHRoaXMuX2FhYmIueCA9IHRoaXMuX2NlbnRlclggLSByYWRpdXM7XG5cdFx0dGhpcy5fYWFiYi55ID0gdGhpcy5fY2VudGVyWSArIHJhZGl1cztcblx0XHR0aGlzLl9hYWJiLnogPSB0aGlzLl9jZW50ZXJaIC0gcmFkaXVzO1xuXHRcdHRoaXMuX3BBYWJiUG9pbnRzRGlydHkgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIGZyb21FeHRyZW1lcyhtaW5YOm51bWJlciwgbWluWTpudW1iZXIsIG1pblo6bnVtYmVyLCBtYXhYOm51bWJlciwgbWF4WTpudW1iZXIsIG1heFo6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fY2VudGVyWCA9IChtYXhYICsgbWluWCkqLjU7XG5cdFx0dGhpcy5fY2VudGVyWSA9IChtYXhZICsgbWluWSkqLjU7XG5cdFx0dGhpcy5fY2VudGVyWiA9IChtYXhaICsgbWluWikqLjU7XG5cblx0XHR2YXIgZDpudW1iZXIgPSBtYXhYIC0gbWluWDtcblx0XHR2YXIgeTpudW1iZXIgPSBtYXhZIC0gbWluWTtcblx0XHR2YXIgejpudW1iZXIgPSBtYXhaIC0gbWluWjtcblxuXHRcdGlmICh5ID4gZClcblx0XHRcdGQgPSB5O1xuXG5cdFx0aWYgKHogPiBkKVxuXHRcdFx0ZCA9IHo7XG5cblx0XHR0aGlzLl9yYWRpdXMgPSBkKk1hdGguc3FydCguNSk7XG5cdFx0c3VwZXIuZnJvbUV4dHJlbWVzKG1pblgsIG1pblksIG1pblosIG1heFgsIG1heFksIG1heFopO1xuXHR9XG5cblx0cHVibGljIGNsb25lKCk6Qm91bmRpbmdWb2x1bWVCYXNlXG5cdHtcblx0XHR2YXIgY2xvbmU6Qm91bmRpbmdTcGhlcmUgPSBuZXcgQm91bmRpbmdTcGhlcmUoKTtcblx0XHRjbG9uZS5mcm9tU3BoZXJlKG5ldyBWZWN0b3IzRCh0aGlzLl9jZW50ZXJYLCB0aGlzLl9jZW50ZXJZLCB0aGlzLl9jZW50ZXJaKSwgdGhpcy5fcmFkaXVzKTtcblx0XHRyZXR1cm4gY2xvbmU7XG5cdH1cblxuXHRwdWJsaWMgcmF5SW50ZXJzZWN0aW9uKHBvc2l0aW9uOlZlY3RvcjNELCBkaXJlY3Rpb246VmVjdG9yM0QsIHRhcmdldE5vcm1hbDpWZWN0b3IzRCk6bnVtYmVyXG5cdHtcblx0XHRpZiAodGhpcy5jb250YWluc1BvaW50KHBvc2l0aW9uKSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIHB4Om51bWJlciA9IHBvc2l0aW9uLnggLSB0aGlzLl9jZW50ZXJYLCBweTpudW1iZXIgPSBwb3NpdGlvbi55IC0gdGhpcy5fY2VudGVyWSwgcHo6bnVtYmVyID0gcG9zaXRpb24ueiAtIHRoaXMuX2NlbnRlclo7XG5cdFx0dmFyIHZ4Om51bWJlciA9IGRpcmVjdGlvbi54LCB2eTpudW1iZXIgPSBkaXJlY3Rpb24ueSwgdno6bnVtYmVyID0gZGlyZWN0aW9uLno7XG5cdFx0dmFyIHJheUVudHJ5RGlzdGFuY2U6bnVtYmVyO1xuXG5cdFx0dmFyIGE6bnVtYmVyID0gdngqdnggKyB2eSp2eSArIHZ6KnZ6O1xuXHRcdHZhciBiOm51bWJlciA9IDIqKCBweCp2eCArIHB5KnZ5ICsgcHoqdnogKTtcblx0XHR2YXIgYzpudW1iZXIgPSBweCpweCArIHB5KnB5ICsgcHoqcHogLSB0aGlzLl9yYWRpdXMqdGhpcy5fcmFkaXVzO1xuXHRcdHZhciBkZXQ6bnVtYmVyID0gYipiIC0gNCphKmM7XG5cblx0XHRpZiAoZGV0ID49IDApIHsgLy8gcmF5IGdvZXMgdGhyb3VnaCBzcGhlcmVcblx0XHRcdHZhciBzcXJ0RGV0Om51bWJlciA9IE1hdGguc3FydChkZXQpO1xuXHRcdFx0cmF5RW50cnlEaXN0YW5jZSA9ICggLWIgLSBzcXJ0RGV0ICkvKCAyKmEgKTtcblx0XHRcdGlmIChyYXlFbnRyeURpc3RhbmNlID49IDApIHtcblx0XHRcdFx0dGFyZ2V0Tm9ybWFsLnggPSBweCArIHJheUVudHJ5RGlzdGFuY2Uqdng7XG5cdFx0XHRcdHRhcmdldE5vcm1hbC55ID0gcHkgKyByYXlFbnRyeURpc3RhbmNlKnZ5O1xuXHRcdFx0XHR0YXJnZXROb3JtYWwueiA9IHB6ICsgcmF5RW50cnlEaXN0YW5jZSp2ejtcblx0XHRcdFx0dGFyZ2V0Tm9ybWFsLm5vcm1hbGl6ZSgpO1xuXG5cdFx0XHRcdHJldHVybiByYXlFbnRyeURpc3RhbmNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJheSBtaXNzZXMgc3BoZXJlXG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cblx0cHVibGljIGNvbnRhaW5zUG9pbnQocG9zaXRpb246VmVjdG9yM0QpOmJvb2xlYW5cblx0e1xuXHRcdHZhciBweDpudW1iZXIgPSBwb3NpdGlvbi54IC0gdGhpcy5fY2VudGVyWDtcblx0XHR2YXIgcHk6bnVtYmVyID0gcG9zaXRpb24ueSAtIHRoaXMuX2NlbnRlclk7XG5cdFx0dmFyIHB6Om51bWJlciA9IHBvc2l0aW9uLnogLSB0aGlzLl9jZW50ZXJaO1xuXHRcdHZhciBkaXN0YW5jZTpudW1iZXIgPSBNYXRoLnNxcnQocHgqcHggKyBweSpweSArIHB6KnB6KTtcblx0XHRyZXR1cm4gZGlzdGFuY2UgPD0gdGhpcy5fcmFkaXVzO1xuXHR9XG5cblx0Ly9Ab3ZlcnJpZGVcblx0cHVibGljIGNsYXNzaWZ5VG9QbGFuZShwbGFuZTpQbGFuZTNEKTpudW1iZXJcblx0e1xuXHRcdHZhciBhOm51bWJlciA9IHBsYW5lLmE7XG5cdFx0dmFyIGI6bnVtYmVyID0gcGxhbmUuYjtcblx0XHR2YXIgYzpudW1iZXIgPSBwbGFuZS5jO1xuXHRcdHZhciBkZDpudW1iZXIgPSBhKnRoaXMuX2NlbnRlclggKyBiKnRoaXMuX2NlbnRlclkgKyBjKnRoaXMuX2NlbnRlclogLSBwbGFuZS5kO1xuXG5cdFx0aWYgKGEgPCAwKVxuXHRcdFx0YSA9IC1hO1xuXG5cdFx0aWYgKGIgPCAwKVxuXHRcdFx0YiA9IC1iO1xuXG5cdFx0aWYgKGMgPCAwKVxuXHRcdFx0YyA9IC1jO1xuXG5cdFx0dmFyIHJyOk51bWJlciA9IChhICsgYiArIGMpKnRoaXMuX3JhZGl1cztcblxuXHRcdHJldHVybiBkZCA+IHJyPyBQbGFuZUNsYXNzaWZpY2F0aW9uLkZST05UIDogZGQgPCAtcnI/IFBsYW5lQ2xhc3NpZmljYXRpb24uQkFDSyA6IFBsYW5lQ2xhc3NpZmljYXRpb24uSU5URVJTRUNUO1xuXHR9XG5cblx0cHVibGljIHRyYW5zZm9ybUZyb20oYm91bmRzOkJvdW5kaW5nVm9sdW1lQmFzZSwgbWF0cml4Ok1hdHJpeDNEKVxuXHR7XG5cdFx0dmFyIHNwaGVyZTpCb3VuZGluZ1NwaGVyZSA9IDxCb3VuZGluZ1NwaGVyZT4gYm91bmRzO1xuXHRcdHZhciBjeDpudW1iZXIgPSBzcGhlcmUuX2NlbnRlclg7XG5cdFx0dmFyIGN5Om51bWJlciA9IHNwaGVyZS5fY2VudGVyWTtcblx0XHR2YXIgY3o6bnVtYmVyID0gc3BoZXJlLl9jZW50ZXJaO1xuXHRcdHZhciByYXc6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KDE2KTtcblxuXHRcdG1hdHJpeC5jb3B5UmF3RGF0YVRvKHJhdyk7XG5cblx0XHR2YXIgbTExOm51bWJlciA9IHJhd1swXSwgbTEyOm51bWJlciA9IHJhd1s0XSwgbTEzOm51bWJlciA9IHJhd1s4XSwgbTE0Om51bWJlciA9IHJhd1sxMl07XG5cdFx0dmFyIG0yMTpudW1iZXIgPSByYXdbMV0sIG0yMjpudW1iZXIgPSByYXdbNV0sIG0yMzpudW1iZXIgPSByYXdbOV0sIG0yNDpudW1iZXIgPSByYXdbMTNdO1xuXHRcdHZhciBtMzE6bnVtYmVyID0gcmF3WzJdLCBtMzI6bnVtYmVyID0gcmF3WzZdLCBtMzM6bnVtYmVyID0gcmF3WzEwXSwgbTM0Om51bWJlciA9IHJhd1sxNF07XG5cblx0XHR0aGlzLl9jZW50ZXJYID0gY3gqbTExICsgY3kqbTEyICsgY3oqbTEzICsgbTE0O1xuXHRcdHRoaXMuX2NlbnRlclkgPSBjeCptMjEgKyBjeSptMjIgKyBjeiptMjMgKyBtMjQ7XG5cdFx0dGhpcy5fY2VudGVyWiA9IGN4Km0zMSArIGN5Km0zMiArIGN6Km0zMyArIG0zNDtcblxuXHRcdGlmIChtMTEgPCAwKVxuXHRcdFx0bTExID0gLW0xMTtcblx0XHRpZiAobTEyIDwgMClcblx0XHRcdG0xMiA9IC1tMTI7XG5cdFx0aWYgKG0xMyA8IDApXG5cdFx0XHRtMTMgPSAtbTEzO1xuXHRcdGlmIChtMjEgPCAwKVxuXHRcdFx0bTIxID0gLW0yMTtcblx0XHRpZiAobTIyIDwgMClcblx0XHRcdG0yMiA9IC1tMjI7XG5cdFx0aWYgKG0yMyA8IDApXG5cdFx0XHRtMjMgPSAtbTIzO1xuXHRcdGlmIChtMzEgPCAwKVxuXHRcdFx0bTMxID0gLW0zMTtcblx0XHRpZiAobTMyIDwgMClcblx0XHRcdG0zMiA9IC1tMzI7XG5cdFx0aWYgKG0zMyA8IDApXG5cdFx0XHRtMzMgPSAtbTMzO1xuXG5cdFx0dmFyIHI6bnVtYmVyID0gc3BoZXJlLl9yYWRpdXM7XG5cdFx0dmFyIHJ4Om51bWJlciA9IG0xMSArIG0xMiArIG0xMztcblx0XHR2YXIgcnk6bnVtYmVyID0gbTIxICsgbTIyICsgbTIzO1xuXHRcdHZhciByejpudW1iZXIgPSBtMzEgKyBtMzIgKyBtMzM7XG5cdFx0dGhpcy5fcmFkaXVzID0gcipNYXRoLnNxcnQocngqcnggKyByeSpyeSArIHJ6KnJ6KTtcblxuXHRcdHRoaXMuX2FhYmIud2lkdGggPSB0aGlzLl9hYWJiLmhlaWdodCA9IHRoaXMuX2FhYmIuZGVwdGggPSB0aGlzLl9yYWRpdXMqMjtcblx0XHR0aGlzLl9hYWJiLnggPSB0aGlzLl9jZW50ZXJYIC0gdGhpcy5fcmFkaXVzO1xuXHRcdHRoaXMuX2FhYmIueSA9IHRoaXMuX2NlbnRlclkgKyB0aGlzLl9yYWRpdXM7XG5cdFx0dGhpcy5fYWFiYi56ID0gdGhpcy5fY2VudGVyWiAtIHRoaXMuX3JhZGl1cztcblx0fVxufVxuXG5leHBvcnQgPSBCb3VuZGluZ1NwaGVyZTsiXX0=