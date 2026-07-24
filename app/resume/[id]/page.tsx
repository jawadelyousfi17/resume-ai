import { Editor } from "@/components/editor/Editor";

export default async function ResumeEditorPage(
  props: PageProps<"/resume/[id]">,
) {
  const { id } = await props.params;
  return <Editor id={id} />;
}
