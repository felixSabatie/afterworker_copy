class RenamePseudoColumnToUsername < ActiveRecord::Migration[5.2]
  def change
    rename_index :users, 'index_users_on_pseudo', 'index_users_on_username'
    rename_column :users, :pseudo, :username
  end
end
