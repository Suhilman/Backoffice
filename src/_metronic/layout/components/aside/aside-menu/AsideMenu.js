import React, { useMemo } from "react";
import AsideMenuList from "./AsideMenuList";
import { useHtmlClassService } from "../../../_core/MetronicLayout";

export function AsideMenu({ disableScroll, hideLabel, hide, stateScroll }) {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes("aside_menu"),
      ulClasses: uiService.getClasses("aside_menu_nav", true),
      asideClassesFromConfig: uiService.getClasses("aside_menu", true)
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        // style={{ height: '100vh', overflow: 'auto' }}
        data-menu-vertical="1"
        className={`aside-menu my-4 ${layoutProps.asideClassesFromConfig}`}
        {...layoutProps.asideMenuAttr}
      >
        <AsideMenuList layoutProps={layoutProps} hideLabel={hideLabel} hide={hide} stateScroll={stateScroll}/>
      </div>
      {/* end::Menu Container */}
    </>
  );
}
