/**
 * Block: Testimonial
 */

 //  Import CSS.
import './style.scss';
import './editor.scss';
import classnames from 'classnames';
import icons from './icons.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { RichText, PlainText, BlockControls, InspectorControls, MediaUpload } = wp.editor; // Import components from wp.editor
const { Toolbar, Button, IconButton, Tooltip, PanelBody, PanelRow, FormToggle } = wp.components; // Import components from wp.components
/**
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ssm/block-testimonial', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Testimonial' ), // Block title.
	icon: 'testimonial', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [ // Limit to 3 keywords
		__( 'Testimonial' ),
		__( 'Gutenberg Block' ),
		__( 'Secret Stache Media' ),
	],
	attributes: {
		quote: {
			type: 'array',
			source: 'children',
			selector: 'p.quote'
		},
		source: {
			type: 'array',
			source: 'children',
			selector: 'span.source'
		},
		quoteSign: {
			type: 'boolean',
			default: false
		},
		imageAPI: {
			type: 'boolean',
			default: false
		},
		imgURL: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
		},
		imgID: {
			type: 'number',
		},
		imgAlt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: 'img',
		},
		emailAddress: {
			type: 'array',
			source: 'children',
			selector: 'p.emailAddress',
		},
		apiKey: {
			type: 'array',
			source: 'children',
			selector: 'p.apiKey',
		},
		apiKeySaved: {
			type: 'boolean',
			default: false
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {

		var quote = props.attributes.quote;
		var source = props.attributes.source;
		var quoteSign = props.attributes.quoteSign;
		var imageAPI = props.attributes.imageAPI;
		var imgURL = props.attributes.imgURL;
		var imgID = props.attributes.imgID;
		var imgAlt = props.attributes.imgAlt;
		var emailAddress = props.attributes.emailAddress;
		var apiKey = props.attributes.apiKey;
		var apiKeySaved = props.attributes.apiKeySaved;
		var isSelected = props.isSelected;

		function onChangeQuote( newQuote ) {
			props.setAttributes( { quote: newQuote } );
		}

		function onChangeSource( newSource ) {
			props.setAttributes( { source: newSource } );
		}

		function onChangeEmailAddress( newEmailAddress ) {
			props.setAttributes( { emailAddress: newEmailAddress } );			
		}

		function onChangeApiKey( newApiKey ) {
			props.setAttributes( { apiKey: newApiKey } );
		}

		function toggleQuoteSign() {
			if (quoteSign) {
				props.setAttributes( { quoteSign: false } )
			} else {
				props.setAttributes( { quoteSign: true } )				
			}
		}
		

		function toggleImageAPI() {
			if (imageAPI) {
				props.setAttributes( { imageAPI: false } )
				props.setAttributes( { imgURL: null, imgID: null, imgAlt: null} )
			} else {
				props.setAttributes( { imageAPI: true } )					
			}

		}

		function onSelectImage( img ) {
			props.setAttributes( { imgURL: img.url, imgID: img.id, imgAlt: img.alt} )
		}

		function onRemoveImage( img ) {
			props.setAttributes( { imgURL: null, imgID: null, imgAlt: null} )
		}

		function saveAPIKey( e ) {
			var key = e.target.dataset.key;
			props.setAttributes( { apiKeySaved: true } )
			console.log(key);
		}

		function callFullcontactAPI() {

			if (imageAPI) {

				fetch('https://api.fullcontact.com/v3/person.enrich', {
					method: 'POST',
					headers: {
						"Authorization": "Bearer " + apiKey
					},
					body: JSON.stringify({
						"email": emailAddress,
					})
				}).then(response => response.json()).then(data => {

					props.setAttributes({
						imgURL: data.avatar,
						imgID: 'fullcontactImage',
						imgAlt: data.fullName
					})
				})
			}
		}

		return (
			<div className='testimonial'>
				<InspectorControls>
					<PanelBody
						title={ __( 'Basic' ) }
					>
						<PanelRow>
							<label
								htmlFor="quote-sign-form-toggle"
							>
								{ __( 'Quote Sign' ) }
							</label>
							<FormToggle
								id="quote-sign-form-toggle"
								label={ __( 'Quote Sign') }
								checked={ quoteSign }
								onChange={ toggleQuoteSign }
							/>
						</PanelRow>

						<PanelRow>
							<label
								htmlFor="image-api-form-toggle"
							>
								{ __( 'Upload Image' ) }
							</label>
							<FormToggle
								id="image-api-form-toggle"
								label={ __( 'Image API') }
								checked={ imageAPI }
								onChange={ toggleImageAPI }
							/>
							<label
								htmlFor="image-api-form-toggle"
							>
								{ __( '  FullContact API' ) }
							</label>
						</PanelRow>

						{ imageAPI ? (
							<div className="ssm-panel-row">
								<PanelRow>
								<label
									htmlFor="apiKey"
								>
									{ __( 'API Key' ) }
								</label>
								</PanelRow>

								<PanelRow>
									<PlainText
										tagName = 'p'
										className = 'apiKey'
										id = 'apiKey'
										onChange = { onChangeApiKey }
										placeholder = { __( 'API Key' ) }
										value = { apiKey }
									/>
								{ ! apiKeySaved ? (
									<Button
										data-key={apiKey}
										className="components-button button button-small"
										onClick={ saveAPIKey }>
										Save
									</Button>
								) : ( 
									<p className="api-key-saved">Saved!</p>
								)}

								</PanelRow>
							</div>
						) : (
							null
						)}
						
					</PanelBody>
				</InspectorControls>

				<BlockControls key="controls">
					<Toolbar>
						<Tooltip text={ __( 'Add Quote Sign' )  }>
							<Button className={ classnames(
								'components-icon-button',
								'components-toolbar-control',
								{ 'active': quoteSign },
							) }
							onClick={ toggleQuoteSign }
							>
							{icons.quoteSign}
							</Button>
						</Tooltip>
					</Toolbar>
				</BlockControls>

				{  isSelected ? (
				
					<div className={classnames(
						'testimonial-inner',
						{ 'quote-sign': quoteSign },
					)}>					
						<h3>{ __('Quote: ') }</h3>
								
						<PlainText
							tagName = 'p'
							className = 'quote'
							onChange = { onChangeQuote }
							placeholder = { __( 'Quote' ) }
							value = { quote }
						/>

						<h3>{ __('Source: ') }</h3>

						<RichText 
							tagName = 'span'
							className = 'source'
							onChange = { onChangeSource }
							placeholder = { __( 'Source' ) }
							value = { source }
						/>

					{ ! imageAPI ? ( 

						<div className="upload-image-section">
					
							{ ! imgID ? (
								<div className="testimonial-image">
									<MediaUpload
										onSelect={ onSelectImage }
										type="image"
										value={ props.attributes.imgID }
										render={ ( { open } ) => (
											<Button
												className="components-button button button-medium"
												onClick={ open }>
												Upload Image
											</Button>
										) }
									/>
								</div>

								) : (
									<div className="testimonial-image">
										<p class="image-wrapper">
											<img
												src={ imgURL }
												alt={ imgAlt }
											/>

											{ isSelected ? (

												<Button
													className="remove-image"
													onClick={ onRemoveImage }
												>
													{ icons.remove }
												</Button>

											) : null }

										</p>
									</div>
								)}
							</div>
					) : (
						<div className="fullcontact-api-section">
							
							<h3>{ __('Email Address: ') }</h3>
							
							<PlainText
								tagName = 'p'
								className = 'emailAddress'
								onChange = { onChangeEmailAddress }
								placeholder = { __( 'Email Address' ) }
								value = { emailAddress }
							/>
						</div>
					)}
					</div>
				
				) : (
					

					<div className={classnames(
						'testimonial-outer',
						{ 'quote-sign': quoteSign },
					)}>

					{callFullcontactAPI()}
						
						<p className='quote' > 
							{ quote + " - " }
						</p>
						<span className='source'> 
							{ source }
						</span>
						<div className='testimonial-image'>
							<p className='image-wrapper'>
								<img
									src={ imgURL }
									alt={ imgAlt }
								/>
							</p>
						</div>
					</div>
				)}
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */

	save: function( props ) {

		var quote = props.attributes.quote;
		var source = props.attributes.source;
		var quoteSign = props.attributes.quoteSign;
		var imgURL = props.attributes.imgURL;
		var imgAlt = props.attributes.imgAlt;

		return (
			<div className='testimonial'>
				<div className={ classnames(
					'testimonial-frontend',
					{ 'quote-sign': quoteSign },
				) }>
					<p className='quote'> 
						{ quote + " - " }
					</p>
					<span className='source'> 
						{ source }
					</span>
				</div>

				<div className='testimonial-image'>
					<p className='image-wrapper'>
						<img
							src={ imgURL }
							alt={ imgAlt }
						/>
					</p>
				</div>

			</div>
		);
	},
	
} );