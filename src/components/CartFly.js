import React, { Component } from "react"
import Singleton from "react-singleton"
import "../util/jqueryFly"

let $ = window.$
class CartFly extends Component {
	constructor(options) {
		super()
		this.state = {
			image: !options.image
				? ""
				: options.image,
			start: options.start,
			callback: () => { }
		}
	}

	componentDidUpdate() {
		let self = this
		let startOffset = $(self.state.start).offset()
		let endOffset = $("#Js-select-car-click-id").offset()
		if (!endOffset) { return false; }
		$(this.Fly).fly({
			start: {
				top: startOffset.top - $(document).scrollTop(),
				left: startOffset.left
			},
			end: {
				top: endOffset.top - $(document).scrollTop(),
				left: endOffset.left,
				width: 20,
				height: 20
			},
			speed: 2,
			onEnd: function () {
				this.destroy()
				self.state.callback()
			}
		})
	}

	render() {
		return (
			<img
				src={this.state.image}
				style={{
					borderRadius: "50%",
					width: "80px",
					height: "80px",
					zIndex: "11000"
				}}
				ref={c => (this.Fly = c)}
			/>
		)
	}
}

export default new Singleton(CartFly)
