{# Products featured that work as examples #}

<section class="section-featured-home" data-store="home-products-{{ section_id }}">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="js-products-{{ section_id }}-title section-title h3 mb-3">{{ products_title }}</h2>
				<div class="row row-grid">
					{% include 'snipplets/defaults/help_item.tpl' with {'help_item_1': true, 'section_columns_desktop': 4, 'section_columns_mobile': 2} %}
					{% include 'snipplets/defaults/help_item.tpl' with {'help_item_2': true, 'section_columns_desktop': 4, 'section_columns_mobile': 2} %}
					{% include 'snipplets/defaults/help_item.tpl' with {'help_item_3': true, 'section_columns_desktop': 4, 'section_columns_mobile': 2} %}
					{% include 'snipplets/defaults/help_item.tpl' with {'help_item_4': true, 'section_columns_desktop': 4, 'section_columns_mobile': 2} %}
				</div>
			</div>
		</div>
	</div>
</section>