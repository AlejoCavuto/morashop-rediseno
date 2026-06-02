<div class="js-desktop-nav-categories js-desktop-nav-item js-nav-main-item js-item-subitems-desktop col-md-auto nav-item nav-item-desktop nav-main-item nav-dropdown main-categories-link item-with-subitems text-uppercase">
    <div class="nav-item-container"> 
    	<a href="{{ store.products_url }}" class="nav-list-link position-relative align-items-center d-flex h-100 pr-1">
    		{% include "snipplets/svg/bars.tpl" with {svg_custom_class: "icon-inline font-big mr-2" } %}
    		{{ 'Categorías' | translate }}
		</a>
    </div>
	<div class="js-desktop-dropdown nav-dropdown-content desktop-dropdown">
		<ul class="desktop-list-subitems list-subitems m-0">
			{% snipplet "navigation/navigation-categories-list.tpl" %}
		</ul>
		{% include 'snipplets/navigation/navigation-banners.tpl' with { 'desktop' : true } %}
	</div>
</div>