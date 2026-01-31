import { redirect } from 'next/navigation';

export default function BookmarksRootRedirect() {
  redirect('/bookmarks/last-read');
}
