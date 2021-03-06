var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var path = require('path')

var methodsFile = require('../lib/file')

var ActionBar = require('../components/actionbar')
var Split = require('../components/split')
var Fields = require('../containers/fields')

module.exports = File

function File (state, emit) {
  var search = queryString.parse(location.search)
  var filename = methodsFile.decodeFilename(search.file)
  var file = state.page.files ? state.page.files[filename] : false
  if (!file) return notFound()
  var blueprint = methodsFile.getBlueprint(state)
  var draftFile = state.enoki.changes[file.url]

  // blueprint layout fix
  blueprint.layout = false

  // display in columns
  return Split(
    [sidebar(), actionbarWrapper()],
    content()
  )

  function content () {
    return html`
      <div
        id="content-file"
        class="psst t0 l0 r0 p1 file-preview"
      >
        ${file.type === 'image' ? image() : ''}
        ${file.type === 'video' ? video() : ''}
        ${file.type === 'audio' ? audio() : ''}
      </div>
    `
  }

  function sidebar () {
    return html`
      <div id="sidebar-file" class="x xdc c12 psst t0">
        <div class="x1 x xdc">
          <div class="p1 c12">
            <div class="c12 fwb usn py1 fs0-8 ttu fc-bg25">
              Filename
            </div>
            <div class="py1 px1-5 input input-disabled truncate">
              ${filename}
            </div>
          </div>
          ${Fields(state, emit, {
            oninput: handleFieldUpdate,
            blueprint: blueprint,
            value: file
          })}
          <div class="p1">
            <span
              class="tac bgch-fg bgc-bg25 fc-bg button-medium"
              onclick=${handleRemove}
            >Delete File</span>
          </div>
        </div>
      </div>
    `
  }

  function actionbarWrapper () {
    return html`
      <div class="psf b0 l0 r0 p1 pen z2">
        <div class="pea">
          ${ActionBar({
            disabled: draftFile === undefined,
            handleSave: handleSave,
            handleCancel: handleCancel
          })}
        </div>
      </div>
    `
  }

  function image () {
    return html`<img src="${file.source}" class="ofc" />`
  }

  function audio () {
    return html`
      <div class="psa t0 l0 r0 b0 x xjc xac">
        <audio
          src="${file.source}"
          controls
        />
      </div>
      `
  }

  function video () {
    return html`
      <div class="psa t0 l0 r0 b0 x xjc xac">
        <video src="${file.source}" controls />
      </div>
    `
  }

  function notFound () {
    return html`
      <div class="p1 xx x xjc xac">
        ${filename} is not found 
      </div>
    `
  }

  function handleFieldUpdate (event, data) {
    emit(state.events.ENOKI_UPDATE, {
      url: file.url,
      data: { [event]: data }
    })
  }

  function handleSave () {
    alert('Image meta saving coming soon')
    // emit(state.events.ENOKI_SAVE, {
    //   file: file.filename + '.txt',
    //   path: state.page.path,
    //   url: file.url,
    //   data: objectKeys(blueprint.fields).reduce(function (result, field) {
    //     result[field] = draftFile[field] === undefined ? file[field] : draftFile[field]
    //     return result
    //   }, { })
    // })
  }

  function handleCancel () {
    emit(state.events.ENOKI_CANCEL, {
      path: file.path,
      url: file.url
    })
  }

  function handleRemove () {
    emit(state.events.ENOKI_REMOVE, {
      path: file.path,
      url: file.url
    })
  } 
}