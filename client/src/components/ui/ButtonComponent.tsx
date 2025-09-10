import React from "react";

const MyButton = React.forwardRef<any>((props, forwardedRef) => (
	<button {...props} ref={forwardedRef} />
));