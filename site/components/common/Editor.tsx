import { Editor as TinyMCE } from '@tinymce/tinymce-react'

export default function Editor({ value = '', onChange = () => {} }) {
  return <div></div>
}

// <TinyMCE
// apiKey="s42mf5an6h5d1ktth4tpv56yp67isksql0jt9ih4ii1c4r7a"
// value={value}
// onEditorChange={onChange}
// init={{
//   height: 500,
//   menubar: false,
//   plugins: [
//     'advlist autolink lists link image',
//     'charmap print preview anchor help',
//     'searchreplace visualblocks code',
//     'insertdatetime media table paste wordcount',
//   ],
//   toolbar:
//     'undo redo | bold italic underline blockquote | formatselect fontsizeselect | \
//     alignleft aligncenter alignright alignjustify | lineheight | \
//     bullist numlist outdent indent | \
//     link image removeformat | styleselect | help',
// }}
// />
