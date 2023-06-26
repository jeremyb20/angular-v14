const navigationCtl = {}

const Navigation = require('../models/Navigation')

navigationCtl.getAllNavigations = async (_req, res) => {
    const navigations = await Navigation.find();
    res.send({ listaNavegación: navigations, success: true });
}

navigationCtl.createNavigation = async (req, res) => {
    if (req.body.isSubRoute) {
        const navigation = await Navigation.findById(req.body.Id);
        const subRoute = {
            routerLink: req.body.routerLink,
            iconClass: req.body.iconClass,
            translate: req.body.translate,
            hasPermission: req.body.hasPermission,
            showInToolbar: req.body.showInToolbar,
            showInSideNav: req.body.showInSideNav,
            isNewRoute: req.body.isNewRoute
        }
        navigation.EISubMenu.push(subRoute);

        navigation.save()
        res.send({ message: 'Sub ruta actualizada', success: true });
    } else {
        const newNavigation = new Navigation(req.body);
        await newNavigation.save();
        res.send({ message: 'Ruta creada', success: true });
    }
}

navigationCtl.getNavigation= async (req, res) => {
    const navigation = await Navigation.findById(req.params.id);
    res.send({ empleado: navigation, success: true });

}
navigationCtl.editNavigation = async (req, res) => {

    await Navigation.findByIdAndUpdate(req.body.Id, req.body);
    res.send({ message: 'Ruta actualizada', success: true });
    
}

navigationCtl.deleteNavigation = async (req, res) => {
    if (req.body.isSubRoute) {
        await Navigation.findOneAndUpdate(
            { _id: req.body.idParental },
            { $pull: { EISubMenu: { _id: req.body._id } } },
            { safe: true, multi: false }
        );
        res.send({ message: 'Sub Ruta eliminada', success: true });

    } else {
        await Navigation.findByIdAndDelete(req.body._id);
        res.send({ message: 'Ruta eliminada', success: true });
    }
}


module.exports = navigationCtl;
