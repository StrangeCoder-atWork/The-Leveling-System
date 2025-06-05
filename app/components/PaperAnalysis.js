import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { askAgentPersonalized } from '@/lib/aiAgent';
import { useSelector, useDispatch } from 'react-redux';

export default function PaperAnalysis() {
  const [papers, setPapers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    score: '',
    totalMarks: '',
    date: '',
    mistakes: '',
    notes: ''
  });
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Load papers from localStorage on component mount
  useEffect(() => {
    const savedPapers = JSON.parse(localStorage.getItem('studentPapers') || '[]');
    setPapers(savedPapers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const savePaper = () => {
    // Validate form
    if (!formData.title || !formData.subject || !formData.score || !formData.totalMarks) {
      alert('Please fill in all required fields');
      return;
    }

    const newPaper = {
      id: currentPaper ? currentPaper.id : Date.now().toString(),
      ...formData,
      date: formData.date || new Date().toISOString().split('T')[0],
      createdAt: currentPaper ? currentPaper.createdAt : new Date().toISOString()
    };

    let updatedPapers;
    if (currentPaper) {
      // Update existing paper
      updatedPapers = papers.map(paper => 
        paper.id === currentPaper.id ? newPaper : paper
      );
    } else {
      // Add new paper
      updatedPapers = [...papers, newPaper];
    }

    setPapers(updatedPapers);
    localStorage.setItem('studentPapers', JSON.stringify(updatedPapers));
    
    // Reset form
    setFormData({
      title: '',
      subject: '',
      score: '',
      totalMarks: '',
      date: '',
      mistakes: '',
      notes: ''
    });
    setCurrentPaper(null);
    setShowForm(false);
    
    // Get AI suggestions for the new/updated paper
    getAiSuggestions(newPaper);
  };

  const editPaper = (paper) => {
    setCurrentPaper(paper);
    setFormData({
      title: paper.title,
      subject: paper.subject,
      score: paper.score,
      totalMarks: paper.totalMarks,
      date: paper.date,
      mistakes: paper.mistakes || '',
      notes: paper.notes || ''
    });
    setShowForm(true);
  };

  const deletePaper = (id) => {
    const updatedPapers = papers.filter(paper => paper.id !== id);
    setPapers(updatedPapers);
    localStorage.setItem('studentPapers', JSON.stringify(updatedPapers));
  };

  const getAiSuggestions = async (paper) => {
    try {
      const userProfile = {
        paperData: paper,
        allPapers: papers,
        type: 'paper_analysis'
      };
      
      const suggestions = await askAgentPersonalized('paper_analysis', userProfile);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
  };

  const calculatePercentage = (score, total) => {
    return ((parseFloat(score) / parseFloat(total)) * 100).toFixed(1);
  };

  return (
    <motion.div 
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📝 Paper Analysis</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Paper'}
        </motion.button>
      </div>

      {/* Paper Form */}
      {showForm && (
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">{currentPaper ? 'Edit Paper' : 'Add New Paper'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            // Update the form inputs to have better text visibility
            <div>
              <label className="block text-sm font-medium text-white mb-1">Paper Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                placeholder="Midterm Exam"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject*</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                placeholder="Mathematics"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Score*</label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                placeholder="85"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks*</label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Mistakes Made</label>
            <textarea
              name="mistakes"
              value={formData.mistakes}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 h-24"
              placeholder="List the mistakes you made in this paper..."
            ></textarea>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 h-24"
              placeholder="Any additional notes about this paper..."
            ></textarea>
          </div>
          
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={savePaper}
            >
              {currentPaper ? 'Update Paper' : 'Save Paper'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Papers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map(paper => (
          <motion.div 
            key={paper.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{paper.title}</h3>
                <span className="text-sm bg-indigo-900 px-2 py-1 rounded">{paper.subject}</span>
              </div>
              
              <div className="mt-4 flex items-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {calculatePercentage(paper.score, paper.totalMarks)}%
                </div>
                <div className="ml-2 text-gray-400">
                  {paper.score}/{paper.totalMarks}
                </div>
              </div>
              
              {paper.date && (
                <div className="mt-2 text-sm text-gray-400">
                  Date: {new Date(paper.date).toLocaleDateString()}
                </div>
              )}
              
              {paper.mistakes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-400">Mistakes:</h4>
                  <p className="text-sm text-gray-300 mt-1">{paper.mistakes}</p>
                </div>
              )}
              
              {paper.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-blue-400">Notes:</h4>
                  <p className="text-sm text-gray-300 mt-1">{paper.notes}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-indigo-400 hover:text-indigo-300"
                  onClick={() => editPaper(paper)}
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deletePaper(paper.id)}
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-green-400 hover:text-green-300"
                  onClick={() => getAiSuggestions(paper)}
                >
                  Get Advice
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {papers.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No papers added yet. Click "Add New Paper" to get started.</p>
        </div>
      )}

      {/* AI Suggestions */}
      {aiSuggestions && (
        <motion.div 
          className="mt-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">AI Analysis & Suggestions</h2>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{aiSuggestions.title}</h3>
              <p className="text-neutral-300">{aiSuggestions.message}</p>
            </div>
            
            {aiSuggestions.actionItems && aiSuggestions.actionItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiSuggestions.actionItems.map((item, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                    <p className="text-neutral-400">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}