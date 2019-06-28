/**
 * Provide methods to deal with Materialize CSS methods.
 */
export class MaterializeUtils {

    /**
     * Init SideNav capacities on target element.
     *
     * @param element
     */
    static initSideNav(element: string, options: any){
        let elem = document.querySelector(element);
        M.Sidenav.init(elem, options);
    }

    /**
     * Open a sidenav.
     *
     * @param element
     */
    static openSideNav(element: string){
        let instance = M.Sidenav.getInstance(document.querySelector(element));
        instance.open();
    }

    /**
     * Close a sidenav.
     *
     * @param element
     */
    static closeSideNav(element: string){
        let instance = M.Sidenav.getInstance(document.querySelector(element));
        instance.close();
    }

    /**
     * open a modal.
     *
     * @param element
     */
    static openModal(element: string){
        let instance = M.Modal.getInstance(document.querySelector(element));
        instance.open();
    }

    /**
     * Close a modal.
     *
     * @param element
     */
    static closeModal(element: string){
        let instance = M.Modal.getInstance(document.querySelector(element));
        instance.close();
    }

    /**
     * Init FormSelect capacities on target element.
     * Optional : Options
     * @param selector
     * @param options
     */
    static initFormSelect(selector: string, options ?: any){
        let opts = {};
        if(options){
            opts = options;
        }
        var elem = document.querySelectorAll(selector);
        M.FormSelect.init(elem, opts);
    }

    /**
     * Init Collapsible capacities on target element.
     * Optional : Options
     * @param selector
     * @param options
     */
    static initCollapsible(selector: string, options ?: any){
        let opts = {};
        if(options){
            opts = options;
        }
        var elem = document.querySelectorAll(selector);
        M.Collapsible.init(elem, opts);
    }

    /**
     * Open Collapsible capacities on target element.
     * @param selector
     * @param index
     */
    static openCollapsible(selector: string, index: number){
        let instance = M.Collapsible.getInstance(document.querySelector(selector));
        instance.open(index);
    }

    /**
     * Init Modal on target element.
     * Optional : Options
     * @param selector
     * @param options
     */
    static initModal(selector: string, options ?: any){
        let opts = {};
        if(options){
            opts = options;
        }
        var elem = document.querySelectorAll(selector);
        M.Modal.init(elem, opts);
    }

    /**
     * Init Tooltip.
     * Optional : Options
     * @param selector
     * @param options
     */
    static initTooltip(selector: string, options ?: any){
        let opts = {};
        if(options){
            opts = options;
        }
        var elem = document.querySelectorAll(selector);
        M.Tooltip.init(elem, opts);
    }

    /**
     * Init Tooltip.
     * Optional : Options
     * @param selector
     * @param options
     */
    static initTabs(selector: string, options ?: any){
        let opts = {};
        if(options){
            opts = options;
        }
        var elem = document.querySelectorAll(selector);
        M.Tabs.init(elem, opts);
    }

    static initDropDown(selector: string, options ?: any){
        let elems = document.querySelectorAll(selector);
        M.Dropdown.init(elems, options);
    }
}
