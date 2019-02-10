class CreateInvites < ActiveRecord::Migration[5.2]
  def change
    create_table :invites do |t|
      t.string :token
      t.references :event, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :invites, :token, unique: true
  end
end
