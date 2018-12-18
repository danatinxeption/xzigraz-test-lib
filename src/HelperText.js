import React, {Component} from 'react';
import classNames from 'classnames';
import propTypes from "prop-types";

class HelperText extends Component {
	constructor(props) {
		super(props);

		this.state = {
			helperText: props.helperText,
			hasLabel: !!props.hasLabel,
		}
	}

	render() {
		const helperTextContainerClasses = classNames('field-help', {
			'no-label': !this.state.hasLabel
		});

		return (
			<div className={helperTextContainerClasses}>
				{this.state.helperText}
			</div>
		);
	}
}

HelperText.propTypes = {
	hasLabel: propTypes.bool,
	helperText: propTypes.string
};

export default HelperText;