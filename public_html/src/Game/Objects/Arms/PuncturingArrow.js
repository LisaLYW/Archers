"use strict";

function PuncturingArrow(
    posX, posY, vX, vY,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    Arrow.call(
        this,
        posX, posY, vX, vY,
        Arrow.eAssets.ePuncturingArrowTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.mVx = vX;
    this.mVy = vY;

    this.mHitSet = new GameObjectSet();
    this.mDamage = 5;

    //particles
    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}

gEngine.Core.inheritPrototype(PuncturingArrow, Arrow);


PuncturingArrow.prototype.update = function () {
    Arrow.prototype.update.call(this);

    this.getRigidBody().setVelocity(this.mVx, this.mVy);

    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

PuncturingArrow.prototype.draw = function (aCamera) {
    this.mParticles.draw(aCamera);
    Arrow.prototype.draw.call(this, aCamera);
};

PuncturingArrow.prototype.createParticle = function (atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particles/Particle2.png", atX, atY, life);

    p.getRenderable().setColor([1, 1, 1, 1]);

    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    var fr = 0.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);

    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);

    // size delta
    p.setSizeDelta(0.98);

    return p;
};

PuncturingArrow.prototype.effectOnObstacle = function (obj) {
    if (!this.mHitSet.hasObject(obj)) {
        this.mHitSet.addToSet(obj);
        this.mDamage--;
    }
};

PuncturingArrow.prototype.effectOnArcher = function (obj) {
    if (obj === this.mMaster) {
        this.mMaster.loseHp(1);
    }
    else {
        obj.loseHp(this.mDamage);
    }
    this.mCurrentState = Arrow.eArrowState.eHit;
};

PuncturingArrow.prototype.effectOnDestroyable = function (obj) {
    Arrow.prototype.effectOnDestroyable.call(this, obj);
};


PuncturingArrow.prototype.transfer = function () {
    var pos = this.getXform().getPosition();
    this.mMaster.getXform().setPosition(pos[0], pos[1]);
    this.mCurrentState = Arrow.eArrowState.eHit;
    this.mGenerateParticles = 0;
};