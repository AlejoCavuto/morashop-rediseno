{% if use_menu %}
	<span class="utilities-container d-inline-block">
		<a href="#" class="js-modal-open utilities-item btn btn-utility pl-0" data-toggle="#nav-hamburger" aria-label="{{ 'Menú' | translate }}" data-component="menu-button">
			{% include "snipplets/svg/bars.tpl" with {svg_custom_class: "icon-inline utilities-icon align-bottom" }%}
		</a>
	</span>
{% elseif use_whatsapp %}
	<span class="utilities-container d-inline-block">
		{% include "snipplets/whatsapp-chat.tpl" with {header: true }%}
	</span>
{% elseif use_account %}
	<span class="utilities-container {% if header_desktop %}d-none d-md-inline-block {% if (languages | length > 1 and settings.languages_header) and store.whatsapp and settings.whatsapp_header_link %}mr-1{% else %}mr-4{% endif %}{% endif %}">
		{% if icon_only %}
			<a href="{% if not customer %}{{ store.customer_login_url }}{% else %}{{ store.customer_home_url }}{% endif %}" class="btn btn-utility">
				{% include "snipplets/svg/user.tpl" with {svg_custom_class: "icon-inline utilities-icon"} %}
			</a>
		{% else %}
			<div class="row no-gutters align-items-center">
				<div class="col-auto pr-0">
					{% include "snipplets/svg/user.tpl" with {svg_custom_class: "icon-inline utilities-icon mr-1"} %}
				</div>
				<div class="col pl-2 text-left">
					{% set account_utilities_classes = header_desktop ? 'd-block' : 'mr-1' %}

					{% if header_desktop %}
						<div class="utilities-text">
					{% endif %}
							{% if not customer %}
								{% if header_desktop %}
									<div class="font-weight-bold">
										{{ "¡Hola!" | translate }} {{ "Iniciá sesión" | translate | a_tag(store.customer_login_url, '', '') }} 
									</div>
								{% else %}
									{{ "Iniciar sesión" | translate | a_tag(store.customer_login_url, '', 'mr-2') }} 
								{% endif %}
								{% if 'mandatory' not in store.customer_accounts %}
									{% if header_desktop %}
										{{ "O podés registrarte" | translate | a_tag(store.customer_register_url, '', 'account_utilities_classes') }}
									{% else %}
										/{{ "Crear cuenta" | translate | a_tag(store.customer_register_url, '', 'ml-1') }}
									{% endif %}		
								{% endif %}
							{% else %}
								{% set customer_short_name = customer.name|split(' ')|slice(0, 1)|join %} 
								{{ "¡Hola, {1}!" | t(customer_short_name) | a_tag(store.customer_home_url, '', 'font-weight-bold ' ~ account_utilities_classes) }}
								{% if not header_desktop %}/{% endif %}
								{{ "Cerrar sesión" | translate | a_tag(store.customer_logout_url, '', '') }}
							{% endif %}
					{% if header_desktop %}
						</div>
					{% endif %}					
				</div>
			</div>
		{% endif %}
	</span>
{% elseif use_languages %}
	<span class="utilities-container nav-dropdown d-inline-block position-relative">
		<span class="align-items-center btn-utility text-right">
			{% for language in languages if language.active %}
				<img class="lazyload" src="{{ 'images/empty-placeholder.png' | static_url }}" data-src="{{ language.country | flag_url }}" alt="{{ language.name }}" />
			{% endfor %}
			{% include "snipplets/svg/chevron-down.tpl" with {svg_custom_class: "icon-inline ml-1"} %}
		</span>
		<div class="nav-dropdown-content desktop-dropdown-small position-absolute">
			{% include "snipplets/navigation/navigation-lang.tpl" with { header: true } %}
		</div>
	</span>
{% elseif use_search %}
	<span class="utilities-container d-inline-block">
		<a href="#" class="js-search-button js-modal-open js-fullscreen-modal-open btn btn-utility utilities-item" data-modal-url="modal-fullscreen-search" data-toggle="#nav-search" aria-label="{{ 'Buscador' | translate }}">
			{% include "snipplets/svg/search.tpl" with {svg_custom_class: "icon-inline align-bottom utilities-icon"} %}
		</a>
	</span>
{% else %}
	<span class="utilities-container d-inline-block">
		<div id="ajax-cart" class="cart-summary" data-component='cart-button'>
			<a 
				{% if settings.ajax_cart and template != 'cart' %}
					href="#"
					data-toggle="#modal-cart" 
					data-modal-url="modal-fullscreen-cart"
				{% else %}
					href="{{ store.cart_url }}" 
				{% endif %}
				class="{% if settings.ajax_cart and template != 'cart' %}js-modal-open js-fullscreen-modal-open{% endif %} btn btn-utility position-relative pr-0"
				>
				{% include "snipplets/svg/bag.tpl" with {svg_custom_class: "icon-inline utilities-icon cart-icon mr-md-1"} %}
				<span class="js-cart-widget-amount badge">{{ "{1}" | translate(cart.items_count ) }}</span>
			</a>	
		</div>
	</span>
{% endif %}