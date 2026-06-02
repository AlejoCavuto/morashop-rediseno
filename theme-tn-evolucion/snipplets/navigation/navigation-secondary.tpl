<div class="{% if settings.desktop_nav_colors and settings.header_colors %}py-2 my-1{% else %}pb-3{% endif %}">
	<ul class="list">
		{% for item in menus[settings.head_secondary_menu] %}
			<li class="secondary-menu-item">
				<a class="secondary-menu-link" href="{{ item.url }}" {% if item.url | is_external %}target="_blank"{% endif %}>{{ item.name }}</a>
			</li>
		{% endfor %}
	</ul>
</div>