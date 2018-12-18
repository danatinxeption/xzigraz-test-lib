import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import propTypes from "prop-types";
import md5 from 'crypto-js/md5';
import HelperText from "./HelperText";

class TextInput extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			id: `${props.options.id}-${md5(props.options.id)}`,
			helperText: props.options.helperText,
			label: props.options.label,
			maxNumber: props.options.maxNumber,
			minNumber: props.options.minNumber,
			inputValue: props.options.inputValue,
			type: props.options.type ? props.options.type : 'text',
			validationMessage: props.options.validationMessage,
			isAmount: !!props.options.isAmount,
			isPassword: !!props.options.isPassword,
			isReadOnly: !!props.options.isReadOnly,
			isRequired: !!props.options.isRequired,
			isSingleLine: !!props.options.isSingleLine,

			isFocused: false,
			isEmpty: true,
			isValidated: false
		};

		if (this.isAutoResizeInput()) {
			this.textareaElement = React.createRef();
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	isAutoResizeInput() {
		const {isAmount, isPassword, isSingleLine} = this.state;

		return !isAmount || !isPassword || !isSingleLine;
	}

	calculateTextAreaHeight() {
		const textArea = this.textareaElement.current,
			{inputValue} = this.state;

		return textArea === null ? 'auto' : inputValue === '' ? 'auto' : textArea.scrollHeight;
	}

	hasLabel() {
		return _.isEmpty(this.state.label);
	}

	buildFieldLabelElement() {
		const {label, id} = this.state;

		let labelElement;

		if (this.hasLabel()) {
			labelElement = (
				<div className="field-label">
					<label htmlFor={id}>{label}</label>
				</div>
			)
		}

		return labelElement;
	}

	buildFieldValueElement() {
		const {
			id,
			inputValue,
			maxLength,
			maxNumber,
			minNumber,
			type,
			isReadOnly,
			isAmount,
			isPassword,
			isSingleLine
		} = this.state;
		const fieldValueContainerClasses = classNames('field-value', {
			'read-only-value': isReadOnly
		});

		let fieldValueElement = (
			<div className={fieldValueContainerClasses}>
				<input
					id={id}
					type={type}
					value={inputValue}
					autoComplete="off"
					maxLength={maxLength}
					onChange={this.handleChange}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					disabled={isReadOnly}
				/>
			</div>
		);

		if (isAmount) {
			fieldValueElement = (
				<div className={fieldValueContainerClasses}>
					<div className="field-value-amount">
						<input
							id={id}
							type="number"
							value={inputValue}
							autoComplete="off"
							min={minNumber}
							max={maxNumber}
							maxLength={maxLength}
							onChange={this.handleChange}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							disabled={isReadOnly}
						/>
					</div>
				</div>
			);
		} else if (isPassword) {
			fieldValueElement = (
				<div className={fieldValueContainerClasses}>
					<input
						id={id}
						type="password"
						value={inputValue}
						autoComplete="off"
						onChange={this.handleChange}
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						disabled={isReadOnly}
					/>
				</div>
			);
		} else if (isSingleLine) {
			if (minNumber || maxNumber) {
				fieldValueElement = (
					<div className={fieldValueContainerClasses}>
						<input
							id={id}
							type="number"
							value={inputValue}
							autoComplete="off"
							min={minNumber}
							max={maxNumber}
							maxLength={maxLength}
							onChange={this.handleChange}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							disabled={isReadOnly}
						/>
					</div>
				);
			}
		} else {
			const style = {
				overflowY: 'hidden',
				height: this.calculateTextAreaHeight()
			};

			fieldValueElement = (
				<div className={fieldValueContainerClasses}>
					<textarea
						ref={this.textareaElement}
						id={id}
						rows={1}
						value={inputValue}
						onChange={this.handleChange}
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						disabled={isReadOnly}
						style={style}
					/>
				</div>
			)
		}

		return fieldValueElement;
	}

	buildValidationMessageElement() {
		const {validationMessage, isValidated} = this.state;

		let validationMessageElement;

		if (isValidated) {
			validationMessageElement = (
				<p className="field-error">{validationMessage}</p>
			)
		}

		return validationMessageElement;
	}

	handleChange(e) {
		const value = e.target.value;
		const fieldId = this.state.id.split('-')[0];
		let state = {};

		state[fieldId] = value;

		this.setState({
			isEmpty: value === null || value === '',
			inputValue: value,
			isValidated: true
		});

		this.props.handleOnChange(state);
	}

	handleMouseEnter() {
		if (this.props.handleMouseEnter) {
			this.props.handleMouseEnter();
		}
	}

	handleMouseLeave() {
		if (this.props.handleMouseLeave) {
			this.props.handleMouseLeave();
		}
	}

	handleFocus() {
		this.setState({isFocused: true});
		if (this.props.handleFocus) {
			this.props.handleFocus();
		}
	}

	handleBlur() {
		this.setState({isFocused: false});
		if (this.props.handleBlur) {
			this.props.handleBlur();
		}
	}

	render() {
		const {
			helperText,
			isFocused,
			isReadOnly,
			isRequired,
			isValidated,
			validationMessage,
			isEmpty
		} = this.state;
		const fieldGroupClasses = classNames('inxeption-ui-toolkit-field-group', {
			'current': isFocused,
			'read-only-field': isReadOnly,
			'required': isRequired,
			'is-invalid': isValidated && validationMessage === '' && validationMessage === null,
			'empty': isEmpty,
			'full': !isEmpty
		});

		return (
			<div className={fieldGroupClasses}>
				{this.buildFieldLabelElement()}
				{this.buildFieldValueElement()}
				{this.buildValidationMessageElement()}
				{helperText && <HelperText hasLabel={this.hasLabel()} helperText={helperText}/>}
			</div>
		)
	}
}

TextInput.propTypes = {
	options: propTypes.shape({
		id: propTypes.string.isRequired,
		helperText: propTypes.string,
		label: propTypes.string,
		maxNumber: propTypes.number,
		minNumber: propTypes.number,
		type: propTypes.string,
		inputValue: propTypes.oneOfType([
			propTypes.string,
			propTypes.number
		]),
		validationMessage: propTypes.string,
		isAmount: propTypes.bool,
		isPassword: propTypes.bool,
		isReadOnly: propTypes.bool,
		isRequired: propTypes.bool,
		isSingleLine: propTypes.bool
	}),
	handleOnChange: propTypes.func.isRequired,
	handleMouseEnter: propTypes.func,
	handleMouseLeave: propTypes.func,
	handleFocus: propTypes.func,
	handleBlur: propTypes.func
};

export default TextInput;