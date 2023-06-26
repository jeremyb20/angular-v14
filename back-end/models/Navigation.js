const { Schema, model } = require('mongoose');

const navigationSchema = new Schema({
    routerLink: { type: String, require: true },
    iconClass: { type: String, require: true },
    translate: { type: String, require: true },
    hasPermission: { type: Boolean, require: true },
    showInToolbar: { type: Boolean, require: true },
    showInSideNav: { type: Boolean, require: true },
    isNewRoute: { type: Boolean, require: true },
    EISubMenu: [{
        routerLink: { type: String, require: true },
        iconClass: { type: String, require: true },
        translate: { type: String, require: true },
        hasPermission: { type: Boolean, require: true },
        showInToolbar: { type: Boolean, require: true },
        showInSideNav: { type: Boolean, require: true },
        isNewRoute: { type: Boolean, require: true }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("Navigation", navigationSchema);
