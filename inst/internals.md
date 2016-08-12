# RCAP

This is a short description of the RCAP internals,
with some possible future improvements in the end.

## Terminology

Some terminology:
* dashboard: The web app created by RCAP when running the notebook
  via `mini.html` (or `rcap.html`), without the rcloud IDE.
* designer: the person that writes the notebook and creates the
  dashboard via the RCAP designer.
* user: the person who runs and manipulates the dashboard.
* back-end: the R process running on the server.
* front-end: the JavaScript process running in the web browser of
  the user.

The RCAP designer creates and updates a notebook asset called
`rcap_designer.json`.

## Initialization

Currently, the notebook needs to call `rcap.result()` from its
last cell. This function has no effect within the notebook, it
only runs in the dashboard.

When called from `mini.html`, `rcap.result()` does the following:
* Retrieves the JSON asset that defines the dashboard
  (`rcap_designer.json`).
* Passes this asset to the front-end, the front-end starts
  building up the dashboard.
* `rcap.result()` parses the asset file, and creates the
  back-end controller.

The controller creates a corresponding back-end control object for each
front-end control. It analyses the code of the update functions of the
controls (e.g. the functions that create the plots), and extracts their
dependencies on control variables. E.g. if a dropdown control is associated
with a variable, and this variable is used in the update function of
another control, then the second control depends on the first.

Once all dependencies are known, the controller builds a dependency
graph, and sorts it topologically. The graph is used to decide which
controls need to be updated after an UI change, and in which order.

Then the controller waits for a message from the front-end. Once the
front-end builds the dashboard in the browser, it sends a message to
the back-end. The message includes the sizes of the plot controls.

Once the controller receives the message, it updates all controls objects,
in the correct order. When a control object is updated it potentially sends
an `update` message to the front-end, so that the corresponding front-end
control can be updated as well. Some controls are static, and their
control objects do not send any updates. E.g. a text control, or a
heading control. Others are dynamic, e.g. plots, tables, or the `rtext`
control. Dynamic controls are updated by their control objects.

When all control objects are updated by the controller, the dashboard
is considered to be initialized.

## Manipulation

Some controls works as input controls. These can be manipulated from
the front-end. E.g. a text entry field, a date picker or a dropdown.
Whenever their change their value, the front-end sends an update event
to the back-end. This includes the unique id of the control(s) that
changed, and the new value(s).

On the back-end, the already existing controller is called to
handle this update. The controller preforms breadh-first-searches
on the dependency graph of the controls. One breadth-first search is
performed for each updated control. All controls that show up in at
least one search, need to be updated on the back-end side.

The topological sort of the dependency graph is used to decide the order
of the updates. The control objects update the front-end controls one by
one.

## Possible future improvements

### Faster startup

Currently the notebook needs to run to completion before the web
dashboard is even shown. A better design would allow showing the
web page before running any of the notebook code. For this we must
improve `rcap.html`, just that its JavaScript code can fetch the
dashboard asset from the notebook and can start building the
dashboard immediately.

### Periodic updates

Currently it is not possible to push code to the front-end periodically.
This would be crucial for example when the dashboard uses data that
is streamed continuously from an external source.

One way to implement this, is to allow periodic updates for controls.
Then the update function of the control would be called, even if the value
of the control hasn't changed. The update function can make use of the new
data, and trigger more control updates, e.g. if it is a `dataSource`
control.

### Table improvements

The data table is a powerful tool, and we can improve it to interact
better with the other parts of the notebook. E.g. it could be possible to
trigger updates when a row of the table is selected.

### More flexible update orders

Sometimes it is desired to specify the order of the updates, to
create a better user experience. E.g. plots that run quicker should
run before the slower ones.

### Better error handling

Right now if some error happens in the back-end, the user does not notice
it, except that some updates just do not work. It would be better to
propagate errors to the front-end, in some consistent way.
