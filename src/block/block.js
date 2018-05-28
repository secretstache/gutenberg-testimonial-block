/**
 * Block: Testimonial
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { RichText, PlainText } = wp.editor;

var el = wp.element.createElement;

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
	keywords: [ // Limit to 3 keywords (be careful!)
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
		var isSelected = props.isSelected;

		function onChangeQuote( newQuote ) {
			props.setAttributes( { quote: newQuote } );
		}

		function onChangeSource( newSource ) {
			props.setAttributes( { source: newSource } );
		}

		return (
			<div className='testimonial'>
				{  isSelected ? (
				<div>					
				
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

				</div>
				
			) : (
				<div>
					<p className='quote'> 
						{ quote }
					</p>
					<span className='source'> 
						{ source }
					</span>
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

		return (
			<div className='testimonial'>
				<p className='quote'> 
					{ quote }
				</p>
				<span className='source'> 
					{ source }
				</span>
			</div>
		);
	},
	
} );