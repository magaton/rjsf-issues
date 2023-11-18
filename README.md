# rjsf-issues
Issues faced while using rjsf

1. Collapse Strategy object is not rendered with appropriate input text fields

- formData is loaded
- RJSF Form is constructed
- Custom Select reads properties from formData and updates it.
- formData is updated through state, but this is not visible in initial render.
- This has been verified by calling explicitely props.onChange, which solves the problem
- componentDidUpdate is not triggered. Form is already constructed.
- With version 5.13.2 UNSAFE_componentWillReceiveProps would be called after when Custom Select updates the state


To reproduce:
- delete node_modules and package-lock.json
- Change rjsf version to be 5.13.2
- You would be able to see form like on image `working.png`

