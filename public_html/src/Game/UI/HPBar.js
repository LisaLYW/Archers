/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

HpBar.eAssets = Object.freeze({
    eRedHeart: "assets/UI/redHeart.png"
});

function HpBar(XPos, YPos, archer) {
    this.mArcher = archer;
    this.mHpBar = [];
    this.mMaxHp = 10;
    this.mHp = 10;
    this.Xpos = XPos;
    this.Ypos = YPos;
    this.mSize = 10;

    GameObjectSet.call(this);

    var i = 0;
    for(i = 0; i < this.mMaxHp; i++)
    {
        var newHp = new TextureRenderable(HpBar.eAssets.eRedHeart);
        newHp.setColor([1, 1, 1, 0]);
        newHp.getXform().setSize(this.mSize, this.mSize);
        newHp.getXform().setPosition(this.Xpos + i * 10, this.Ypos);
        this.mHpBar.push(newHp);
    }
}

HpBar.prototype.update = function () {
    this.mHp = this.mArcher.getHp();
};

HpBar.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mHp; i++) {
        this.mHpBar[i].draw(aCamera);
    }
};