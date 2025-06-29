import React from 'react';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Button from '../../components/UI/Button';

interface AddBudgetProps {
  categories: { id: number; name: string }[];
  formData: {
    categoryId: string;
    amount: string;
    month: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    categoryId: string;
    amount: string;
    month: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const AddBudget: React.FC<AddBudgetProps> = ({
  categories,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Budget' : 'Add New Budget'}
        </h3>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
            }
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              })),
            ]}
            required
          />

          <Input
            type="number"
            step="0.01"
            label="Budget Amount (₹)"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            required
          />

          <Input
            type="month"
            label="Month"
            value={formData.month}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, month: e.target.value }))
            }
            required
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            {isEditing ? 'Update Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBudget;
