import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Plus, Trash2, Search, CheckCircle, AlertCircle, X } from 'lucide-react';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState({ type: '', text: '' });

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: 'UPSC / Civil Services',
    coverImageUrl: '',
    available: true,
    isbn: '',
    description: '',
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      const res = await api.get(`/api/books?${params.toString()}`);
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admin/books', newBook);
      if (res.data.success) {
        setActionNotice({ type: 'success', text: `Book "${newBook.title}" added to collection!` });
        setAddModalOpen(false);
        setNewBook({
          title: '',
          author: '',
          genre: 'UPSC / Civil Services',
          coverImageUrl: '',
          available: true,
          isbn: '',
          description: '',
        });
        fetchBooks();
      }
    } catch (err) {
      setActionNotice({ type: 'error', text: err.response?.data?.message || 'Error adding book.' });
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;

    try {
      const res = await api.delete(`/api/admin/books/${id}`);
      if (res.data.success) {
        setActionNotice({ type: 'success', text: `Book "${title}" deleted.` });
        fetchBooks();
      }
    } catch (err) {
      setActionNotice({ type: 'error', text: 'Failed to delete book.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Book Collection Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Maintain the reference library catalog displayed to visitors and members.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {actionNotice.text && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionNotice.text}</span>
          <button onClick={() => setActionNotice({ type: '', text: '' })} className="font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search books by title, author, genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
          />
        </div>
        <button
          onClick={fetchBooks}
          className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800"
        >
          Filter
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : books.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No books found in collection.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Cover & Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={b.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=100&q=80'}
                        alt={b.title}
                        className="w-10 h-14 object-cover rounded-md shadow-sm shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{b.title}</div>
                        {b.isbn && <div className="text-[10px] text-slate-400">ISBN: {b.isbn}</div>}
                      </div>
                    </td>
                    <td className="py-3 px-4">{b.author}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{b.genre}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.available ? 'Available' : 'Reference Only'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteBook(b._id, b.title)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD BOOK MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Add Book to Catalog</h3>
            <p className="text-xs text-slate-500 mb-4">Enter details to add book to the public showcase.</p>

            <form onSubmit={handleAddBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="e.g. Indian Economy by Ramesh Singh"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="e.g. Ramesh Singh"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Genre / Category *</label>
                <select
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="UPSC / Civil Services">UPSC / Civil Services</option>
                  <option value="Competitive Exams / SSC / Banking">Competitive Exams / SSC / Banking</option>
                  <option value="Engineering / JEE">Engineering / JEE</option>
                  <option value="Science & Cosmology">Science & Cosmology</option>
                  <option value="History & Culture">History & Culture</option>
                  <option value="Self-Help & Productivity">Self-Help & Productivity</option>
                  <option value="Finance & Economics">Finance & Economics</option>
                  <option value="Biography">Biography</option>
                  <option value="Literature & Fiction">Literature & Fiction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  value={newBook.coverImageUrl}
                  onChange={(e) => setNewBook({ ...newBook, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Brief synopsis or reference notes..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
