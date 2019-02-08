class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :pseudo, unique: true
      t.string :email, unique: true
      t.string :password_digest
      t.string :avatar_link

      t.timestamps
    end
  end
end
