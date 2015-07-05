# HTML TABLE to CSV/JSON

A Chrome extension that converts an html table into CSV or JSON text format.

The extension adds a context menu item to pages. When chosen, the code grabs the target element, walks up the DOM until the element is a TABLE, and then walks through the element for all the TR elements. The resulting Array< Array< string\>> is then converted to the appropriate output and rendered as text on a fresh page.
