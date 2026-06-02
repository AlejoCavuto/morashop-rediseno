{# Video that work as examples #}

<section class="section-video-home" data-store="home-video">
	<div class="home-video embed-responsive embed-responsive-16by9">
		{% include "snipplets/svg/help/help-video.tpl" %}
		<div class="placeholder-overlay transition-soft">
		<div class="placeholder-info">
				{% include "snipplets/svg/edit.tpl" with {svg_custom_class: "icon-inline icon-3x"} %}
				<div class="placeholder-description font-small-xs">
					{{ "Podés subir tu video de YouTube desde" | translate }} <strong>"{{ "Video" | translate }}"</strong>
				</div>
				{% if not params.preview %}
					<a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
				{% endif %}
			</div>
		</div>
	</div>
</section>