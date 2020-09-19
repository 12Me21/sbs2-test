<!--/* trick indenter
with (View) (function($) { "use strict" //*/

addView('editpage', {
	init: function() {
		$editorTextarea.oninput = function() {
			updatePreview(true)
		}
		$markupSelect.onchange = function() {
			updatePreview(true)
		}
		$markupUpdate.onclick = function() {
			updatePreview(false)
		}
		$submitEdit.onclick = function() {
			submitEdit(function(e, resp) {
				if (!e) {
					Nav.go("page/"+resp.id)
				} else {
					alert("Error submitting page!")
				}
			})
		}
		categoryInput = Draw.categoryInput()
		permissionInput = Draw.permissionInput()
		$editPageCategory.replaceChildren(categoryInput.element)
		$editPagePermissions.replaceChildren(permissionInput.element)
	},
	start: function(id, query, render) {
		return Req.getPageEditView(id, query.cid, render)
	},
	className: 'editorMode',
	render: function(page) {
		categoryInput.update()
		if (page.id) {
			setTitle("Editing Page")
			fillFields(page)
			editingPage = {id: page.id, values: page.values, permissions: page.permissions}
			setEntityPath(page)
		} else {
			setTitle("Creating Page")
			resetFields(page)
			editingPage = {}
			setEntityPath(page.parent)
		}
	},
	cleanUp: function() {
		$editorPreview.replaceChildren()
		editingPage = null
	},
})

var categoryInput = null
var editingPage = null
var permissionInput = null

function submitEdit(callback) {
	if (!editingPage)
		return
	readFields(editingPage)
	Req.editPage(editingPage, callback)
}

function updatePreview() {
	var parent = $editorPreview
	var shouldScroll = parent.scrollHeight-parent.clientHeight-parent.scrollTop < 10
	$editorPreview.replaceChildren(Parse.parseLang($editorTextarea.value, $markupSelect.value))
	// auto scroll down when adding new lines to the end (presumably)
	if (shouldScroll)
		parent.scrollTop = parent.scrollHeight-parent.clientHeight
}

function resetFields(page) {
	$titleInput.value = ""
	$markupSelect.value = '12y'
	$editorTextarea.value = ""
	updatePreview()
	$keywords.value = ""
	$editPageType.value = ""
	if (page.parent)
		categoryInput.set(page.parent.id)
	else
		categoryInput.set(-1)
	permissionInput.set({'0':"r"})
}

function readFields(page) {
	page.name = $titleInput.value
	if (!page.values)
		page.values = {}
	page.values.markupLang = $markupSelect.value
	page.content = $editorTextarea.value
	page.keywords = $keywords.value.split(" ")
	page.type = $editPageType.value
	page.parentId = categoryInput.get()
	page.permissions = permissionInput.get()
}

function fillFields(page) {
	$titleInput.value = page.name
	if (page.values)
		var markup = page.values.markupLang
	if (!markup)
		markup = "plaintext"
	$markupSelect.value = markup
	$editorTextarea.value = page.content
	updatePreview()
	$keywords.value = page.keywords.join(" ")
	$editPageType.value = page.type
	categoryInput.set(page.parentId)
	permissionInput.set(page.permissions)
}

<!--/*
}(window)) //*/ // pass external values